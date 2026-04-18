package com.example.focusapp.service;

import com.example.focusapp.dto.*;
import com.example.focusapp.entity.GoalConfig;
import com.example.focusapp.entity.GoalDefinition;
import com.example.focusapp.entity.GoalPlan;
import com.example.focusapp.entity.User;
import com.example.focusapp.entity.Character;
import com.example.focusapp.entity.GoalStatus;
import com.example.focusapp.repository.GoalConfigRepository;
import com.example.focusapp.repository.GoalDefinitionRepository;
import com.example.focusapp.repository.GoalPlanRepository;
import com.example.focusapp.repository.CharacterRepository;
import com.example.focusapp.repository.UserRepository;
import com.example.focusapp.service.DailyTaskService;
import com.example.focusapp.service.GoalPlanService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class OnboardingService {

    private final UserRepository userRepository;
    private final GoalDefinitionRepository goalDefinitionRepository;
    private final GoalPlanRepository goalPlanRepository;
    private final GoalConfigRepository goalConfigRepository;
    private final DailyTaskService dailyTaskService;
    private final CharacterRepository characterRepository;
    private final GoalPlanService goalPlanService;

//    public OnboardingService(
//            UserRepository userRepository,
//            GoalDefinitionRepository goalDefinitionRepository,
//            GoalPlanRepository goalPlanRepository,
//            GoalConfigRepository goalConfigRepository,
//            DailyTaskService dailyTaskService,
//            CharacterRepository characterRepository
//    ) {
//        this.userRepository = userRepository;
//        this.goalDefinitionRepository = goalDefinitionRepository;
//        this.goalPlanRepository = goalPlanRepository;
//        this.goalConfigRepository = goalConfigRepository;
//        this.dailyTaskService = dailyTaskService;
//        this.characterRepository = characterRepository;
//    }

    @Transactional(readOnly = true)
    public OnboardingStatusResponse getStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        boolean hasUsername = user.getUsername() != null && !user.getUsername().trim().isEmpty();
        boolean hasGoal = goalDefinitionRepository.existsByUserId(userId);

        return new OnboardingStatusResponse(
                user.getId(),
                hasUsername,
                user.getUsername(),
                hasGoal
        );
    }

    @Transactional(readOnly = true)
    public NicknameCheckResponse checkNickname(String username) {
        String trimmedUsername = username == null ? "" : username.trim();

        if (trimmedUsername.isEmpty()) {
            return new NicknameCheckResponse(false, "별명을 입력해주세요.");
        }

        boolean exists = userRepository.existsByUsername(trimmedUsername);

        if (exists) {
            return new NicknameCheckResponse(false, "이미 사용 중인 별명입니다.");
        }

        return new NicknameCheckResponse(true, "사용 가능한 별명입니다.");
    }

    @Transactional
    public SaveUsernameResponse saveUsername(SaveUsernameRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        String trimmedUsername = request.getUsername() == null ? "" : request.getUsername().trim();

        if (trimmedUsername.isEmpty()) {
            throw new IllegalArgumentException("별명을 입력해주세요.");
        }

        boolean duplicated = userRepository.existsByUsernameAndIdNot(trimmedUsername, user.getId());
        if (duplicated) {
            throw new IllegalArgumentException("이미 사용 중인 별명입니다.");
        }

        user.setUsername(trimmedUsername);
        userRepository.save(user);

        return new SaveUsernameResponse(
                user.getId(),
                user.getUsername(),
                "별명이 저장되었습니다."
        );
    }

    @Transactional
    public SetupResponse setup(SetupRequest request) {
        return goalPlanService.createGoalPlan(request);
//        User user = userRepository.findById(request.getUserId())
//                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."));
//
//        boolean hasUsername = user.getUsername() != null && !user.getUsername().trim().isEmpty();
//        if (!hasUsername) {
//            throw new IllegalStateException("별명을 먼저 설정해주세요.");
//        }
//
//        boolean alreadyHasGoal = goalDefinitionRepository.existsByUserIdAndTitle(
//                request.getUserId(),request.getGoalTitle().trim());
//        if (alreadyHasGoal) {
//            throw new IllegalStateException("이미 목표가 존재합니다.");
//        }
//
//        GoalDefinition goalDefinition = new GoalDefinition();
//        goalDefinition.setUserId(request.getUserId());
//        goalDefinition.setTitle(request.getGoalTitle());
//        goalDefinition.setMotto(request.getMotto());
//        goalDefinition = goalDefinitionRepository.save(goalDefinition);
//
//
//        GoalPlan goalPlan = new GoalPlan();
//        goalPlan.setGoalDefinition(goalDefinition);
//
//        Character character = characterRepository.findById(request.getCharacterId())
//                .orElseThrow(() -> new IllegalArgumentException("캐릭터 없음"));
//
//        goalPlan.setCharacter(character);
//
//        goalPlan.setStartDate(request.getStartDate());
//        goalPlan.setEndDate(request.getEndDate());
//        goalPlan.setCurrentLevel(1); // 레벨 1로 초기화
//        goalPlan.setStatus(GoalStatus.ACTIVE);
//        goalPlan.setUser(user);
//
//        goalPlan = goalPlanRepository.save(goalPlan);
//
//
//
//        // 주기 생성
//        GoalConfig goalConfig = GoalConfig.builder()
//                .goalPlan(goalPlan)
//                .alarmCycle(request.getAlarmCycle())
//                .preferredEmoji(request.getPreferredEmoji())
//                .build();
//
//        goalConfigRepository.saveAndFlush(goalConfig);
//
//        dailyTaskService.generateInitialTasks(goalPlan.getId());
//
//        return new SetupResponse(
//                goalPlan.getId(),
//                goalPlan.getUser().getId(),
//                goalPlan.getGoalDefinitionId(),
//                goalPlan.getCharacter().getId(),
//                goalPlan.getStartDate(),
//                goalPlan.getEndDate(),
//                goalPlan.getStatus().toString(),
//                goalDefinition.getTitle(),
//                "목표 설정이 완료되었습니다."
//        );
//    }
    }
}