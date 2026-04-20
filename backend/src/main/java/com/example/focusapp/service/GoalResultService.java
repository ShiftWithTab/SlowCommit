package com.example.focusapp.service;

import com.example.focusapp.dto.CharacterResponse;
import com.example.focusapp.dto.GoalResultResponse;
import com.example.focusapp.entity.*;
import com.example.focusapp.repository.DailyTaskRepository;
import com.example.focusapp.repository.GoalPlanRepository;
import com.example.focusapp.repository.GoalResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class GoalResultService {

    private final GoalResultRepository goalResultRepository;
    private final GoalPlanRepository goalPlanRepository;
    private final DailyTaskRepository dailyTaskRepository;
    private final CharacterService characterService;

    private static final Random random = new Random();

    // =========================
    // CREATE RESULT
    // =========================
    @Transactional
    public void createResult(GoalPlan goalPlan) {
        // ⭐ 종료일 +1일 이후인지 체크
        if (LocalDate.now().isBefore(goalPlan.getEndDate().plusDays(1))) {
            return; // 아직 결과 생성 시점 아님
        }
        goalResultRepository.findByGoalPlan_Id(goalPlan.getId())
                .ifPresentOrElse(
                        r -> {
                            // 이미 있으면 아무것도 안함
                            return;
                        },
                        () -> {
                            double progress = calculateProgress(goalPlan);
                            ResultType type = calculateResult(progress);
                            String message = generateMessage(type);

                            GoalResult result = new GoalResult(goalPlan, type, message);
                            goalResultRepository.save(result);
                        }
                );
    }

    // =========================
    // SINGLE RESULT
    // =========================
    @Transactional(readOnly = true)
    public GoalResultResponse getResult(GoalPlan goalPlan) {

        GoalResult result = goalResultRepository
                .findByGoalPlan_IdAndGoalPlan_User_Id(
                        goalPlan.getId(),
                        goalPlan.getUser().getId()
                )
                .orElseThrow(() -> new RuntimeException("결과 없음"));

        CharacterResponse character =
                characterService.getCurrentCharacter(goalPlan.getUser().getId());

        return toResponse(result, goalPlan, character);
    }

    // =========================
    // NEXT RESULT (🔥 핵심)
    // =========================
    @Transactional
    public GoalResultResponse getNextPendingResult(Long userId) {

        // ⭐ 1. 모든 goalPlan 결과 생성 보장
        List<GoalPlan> plans = goalPlanRepository.findByUserId(userId);
        for (GoalPlan plan : plans) {
            createResult(plan);
        }

        // ⭐ 2. 안 본 결과 조회
        List<GoalResult> results =
                goalResultRepository.findByGoalPlan_User_IdAndIsSeenFalseOrderByCreatedAtAsc(userId);

        if (results.isEmpty()) return null;

        // ⭐ 3. 가장 오래된 것 1개
        GoalResult result = results.get(0);

        // ⭐ 4. 소비 처리
        result.markAsSeen();

        CharacterResponse character =
                characterService.getCurrentCharacter(userId);

        return toResponse(result, result.getGoalPlan(), character);
    }

    // =========================
    // PENDING LIST
    // =========================
    @Transactional(readOnly = true)
    public List<GoalResultResponse> getPendingResults(Long userId) {

        List<GoalResult> results =
                goalResultRepository.findByGoalPlan_User_IdAndIsSeenFalseOrderByCreatedAtAsc(userId);

        CharacterResponse character =
                characterService.getCurrentCharacter(userId);

        return results.stream()
                .map(r -> toResponse(r, r.getGoalPlan(), character))
                .toList();
    }

    // =========================
    // MARK AS SEEN
    // =========================
    @Transactional
    public void markAsSeen(Long goalPlanId, Long userId) {

        GoalResult result = goalResultRepository
                .findByGoalPlan_IdAndGoalPlan_User_Id(goalPlanId, userId)
                .orElseThrow(() -> new RuntimeException("결과 없음"));

        result.markAsSeen();
    }

    // =========================
    // UTILS
    // =========================
    private GoalResultResponse toResponse(
            GoalResult result,
            GoalPlan plan,
            CharacterResponse character
    ) {
        return new GoalResultResponse(
                plan.getId(),
                result.getResultType(),
                result.getMessage(),
                result.getCreatedAt(),
                character.getImageUrl(),
                character.getLevel(),
                plan.getGoalDefinition().getTitle()
        );
    }

    private double calculateProgress(GoalPlan goalPlan) {
        long total = dailyTaskRepository.countByGoalPlan(goalPlan);
        long done = dailyTaskRepository.countByGoalPlanAndCompletedTrue(goalPlan);
        return total == 0 ? 0 : (double) done / total * 100;
    }

    private ResultType calculateResult(double progress) {
        if (progress >= 100) return ResultType.SUCCESS;
        if (progress >= 30) return ResultType.PARTIAL;
        return ResultType.FAILED;
    }

    private String generateMessage(ResultType type) {
        return switch (type) {
            case SUCCESS -> getRandom(List.of(
                    "목표 달성! 축하합니다 🎓",
                    "해냈네요! 정말 대단해요 🎉",
                    "완벽한 결과! 👏"
            ));
            case PARTIAL -> getRandom(List.of(
                    "조금씩 나아가고 있어요 🌱",
                    "좋은 흐름이에요 🔥",
                    "꾸준함이 중요합니다 💪"
            ));
            case FAILED -> getRandom(List.of(
                    "다음엔 더 좋아질 거예요 🙂",
                    "과정이 중요합니다 🚀",
                    "이번 경험도 의미 있어요 💡"
            ));
        };
    }

    private String getRandom(List<String> list) {
        return list.get(random.nextInt(list.size()));
    }
}