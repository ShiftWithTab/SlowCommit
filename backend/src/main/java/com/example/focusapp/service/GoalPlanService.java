package com.example.focusapp.service;

import com.example.focusapp.dto.GoalPlanResponse;
import com.example.focusapp.dto.UpdateGoalRequest;
import com.example.focusapp.entity.*;
import com.example.focusapp.entity.Character;
import com.example.focusapp.repository.CharacterRepository;
import com.example.focusapp.repository.GoalPlanRepository;
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

        boolean active = plan.getStatus() == GoalStatus.ACTIVE;

        return new GoalPlanResponse(
                plan.getId(),
                title,
                emoji,
                characterId,
                characterName,
                active
        );
    }
}