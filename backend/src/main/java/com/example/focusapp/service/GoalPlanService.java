package com.example.focusapp.service;

import com.example.focusapp.dto.GoalPlanResponse;
import com.example.focusapp.dto.UpdateGoalRequest;
import com.example.focusapp.dto.SetupRequest;
import com.example.focusapp.dto.SetupResponse;
import com.example.focusapp.entity.*;
import com.example.focusapp.entity.Character;
import com.example.focusapp.repository.CharacterRepository;
import com.example.focusapp.repository.GoalPlanRepository;
import com.example.focusapp.repository.UserRepository;
import com.example.focusapp.repository.GoalDefinitionRepository;
import com.example.focusapp.repository.GoalConfigRepository;
import com.example.focusapp.dto.GoalConfigAlarmCycleUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalPlanService {

    private final GoalPlanRepository goalPlanRepository;
    private final CharacterRepository characterRepository;

    private final UserRepository userRepository;
    private final GoalDefinitionRepository goalDefinitionRepository;
    private final GoalConfigRepository goalConfigRepository;
    private final DailyTaskService dailyTaskService;

    @Transactional
    public List<GoalPlanResponse> getGoalPlans(Long userId) {
        List<GoalPlan> plans = goalPlanRepository.findByUserId(userId);

        for (GoalPlan plan : plans) {
            updateStatusIfExpired(plan);
        }

        return plans.stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public List<GoalPlanResponse> getActiveGoals(Long userId) {
        List<GoalPlan> plans = goalPlanRepository.findByUserIdAndStatus(userId, GoalStatus.ACTIVE);

        for (GoalPlan plan : plans) {
            updateStatusIfExpired(plan);
        }

        return plans.stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public GoalPlanResponse updateAlarmCycle(Long goalPlanId, GoalConfigAlarmCycleUpdateRequest request) {
        GoalPlan plan = getGoalPlanEntity(goalPlanId);

        updateStatusIfExpired(plan);

        if (plan.getStatus() == GoalStatus.COMPLETED) {
            throw new IllegalStateException("종료된 목표는 수정할 수 없습니다.");
        }

        if (request.getAlarmCycle() == null || request.getAlarmCycle() <= 0) {
            throw new IllegalArgumentException("알림 주기는 1 이상이어야 합니다.");
        }

        if (plan.getGoalConfig() == null) {
            throw new IllegalStateException("목표 설정이 존재하지 않습니다.");
        }

        plan.getGoalConfig().setAlarmCycle(request.getAlarmCycle());

        return toDto(plan);
    }
    @Transactional
    public GoalPlanResponse updateGoal(Long goalId, UpdateGoalRequest request) {
        GoalPlan plan = getGoalPlanEntity(goalId);

        updateStatusIfExpired(plan);

        if (plan.getStatus() == GoalStatus.COMPLETED) {
            throw new IllegalStateException("종료된 목표는 수정할 수 없습니다.");
        }

        if (request.getTitle() != null) {
            plan.getGoalDefinition().setTitle(request.getTitle());
        }

        if (plan.getGoalConfig() != null && request.getEmoji() != null) {
            plan.getGoalConfig().setPreferredEmoji(request.getEmoji());
        }

        if (request.getCharacterId() != null) {
            Character character = characterRepository.findById(request.getCharacterId())
                    .orElseThrow(() -> new IllegalArgumentException("캐릭터가 존재하지 않습니다."));

            plan.setCharacter(character);
        }

        return toDto(plan);
    }
    @Transactional(readOnly = true)
    public GoalPlanResponse getGoal(Long goalId) {
        GoalPlan plan = goalPlanRepository.findById(goalId)
                .orElseThrow(() -> new IllegalArgumentException("목표가 존재하지 않습니다."));

        updateStatusIfExpired(plan);

        return toDto(plan);
    }

    @Transactional
    public SetupResponse createGoalPlan(SetupRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        boolean hasUsername = user.getUsername() != null && !user.getUsername().trim().isEmpty();
        if (!hasUsername) {
            throw new IllegalStateException("별명을 먼저 설정해주세요.");
        }

        boolean alreadyHasGoal = goalDefinitionRepository.existsByUserIdAndTitle(
                request.getUserId(), request.getGoalTitle().trim());
        if (alreadyHasGoal) {
            throw new IllegalStateException("이미 목표가 존재합니다.");
        }

        GoalDefinition goalDefinition = new GoalDefinition();
        goalDefinition.setUserId(request.getUserId());
        goalDefinition.setTitle(request.getGoalTitle());
        goalDefinition.setMotto(request.getMotto());
        goalDefinition = goalDefinitionRepository.save(goalDefinition);

        GoalPlan goalPlan = new GoalPlan();
        goalPlan.setGoalDefinition(goalDefinition);

        Character character = characterRepository.findById(request.getCharacterId())
                .orElseThrow(() -> new IllegalArgumentException("캐릭터가 존재하지 않습니다."));

        goalPlan.setCharacter(character);
        goalPlan.setStartDate(request.getStartDate());
        goalPlan.setEndDate(request.getEndDate());
        goalPlan.setCurrentLevel(1);
        goalPlan.setStatus(GoalStatus.ACTIVE);
        goalPlan.setUser(user);

        goalPlan = goalPlanRepository.save(goalPlan);

        String emoji = request.getPreferredEmoji();
        if (emoji == null || emoji.trim().isEmpty()) {
            throw new IllegalArgumentException("이모지를 입력해주세요.");
        }

        GoalConfig goalConfig = GoalConfig.builder()
                .goalPlan(goalPlan)
                .alarmCycle(1) // ⭐ 기본값
                .preferredEmoji(request.getPreferredEmoji())
                .build();

        goalConfigRepository.saveAndFlush(goalConfig);

//        dailyTaskService.generateInitialTasks(goalPlan.getId());

        return new SetupResponse(
                goalPlan.getId(),
                goalPlan.getUser().getId(),
                goalPlan.getGoalDefinitionId(),
                goalPlan.getCharacter().getId(),
                goalPlan.getStartDate(),
                goalPlan.getEndDate(),
                goalPlan.getStatus().toString(),
                goalDefinition.getTitle(),
                "목표 설정이 완료되었습니다."
        );
    }

    @Transactional
    public GoalPlanResponse updateStatus(Long goalId, String status) {
        GoalPlan plan = getGoalPlanEntity(goalId);

        updateStatusIfExpired(plan);

        if (plan.getStatus() == GoalStatus.COMPLETED) {
            throw new IllegalStateException("종료된 목표는 상태를 변경할 수 없습니다.");
        }

        GoalStatus newStatus;
        try {
            newStatus = GoalStatus.valueOf(status);
        } catch (Exception e) {
            throw new IllegalArgumentException("잘못된 상태값입니다.");
        }

        plan.setStatus(newStatus);

        return toDto(plan);
    }

    private GoalPlan getGoalPlanEntity(Long goalId) {
        return goalPlanRepository.findById(goalId)
                .orElseThrow(() -> new IllegalArgumentException("목표가 존재하지 않습니다."));
    }

    private void updateStatusIfExpired(GoalPlan plan) {
        if (plan.getEndDate().isBefore(LocalDate.now())
                && plan.getStatus() == GoalStatus.ACTIVE) {
            plan.setStatus(GoalStatus.COMPLETED);
        }
    }

    private GoalPlanResponse toDto(GoalPlan plan) {

        String title = plan.getGoalDefinition() != null
                ? plan.getGoalDefinition().getTitle()
                : null;

        String emoji = plan.getGoalConfig() != null
                ? plan.getGoalConfig().getPreferredEmoji()
                : null;

        Long characterId = plan.getCharacter() != null
                ? plan.getCharacter().getId()
                : null;

        String characterName = plan.getCharacter() != null
                ? plan.getCharacter().getName()
                : null;

        String motto = plan.getGoalDefinition() != null
                ? plan.getGoalDefinition().getMotto()
                : null;

        boolean active = plan.getStatus() == GoalStatus.ACTIVE;

        return new GoalPlanResponse(
                plan.getId(),
                title,
                emoji,
                characterId,
                characterName,
                active,
                motto,
                plan.getGoalConfig().getAlarmCycle(),
                plan.getEndDate()
        );
    }
}