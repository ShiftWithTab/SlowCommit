package com.example.focusapp.service;

import com.example.focusapp.dto.CharacterResponse;
import com.example.focusapp.dto.GoalResultResponse;
import com.example.focusapp.entity.*;
import com.example.focusapp.repository.DailyTaskRepository;
import com.example.focusapp.repository.GoalResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class GoalResultService {

    private final GoalResultRepository goalResultRepository;
    private final DailyTaskRepository dailyTaskRepository;
    private final CharacterService characterService;

    /**
     * 결과 생성 (핵심)
     */
    @Transactional
    public void createResult(GoalPlan goalPlan) {

        // ⭐ immutable 보장
        if (goalResultRepository.existsByGoalPlan(goalPlan)) {
            return;
        }

        double progress = calculateProgress(goalPlan);

        ResultType resultType = calculateResult(progress);

        String message = generateMessage(resultType);

        GoalResult result = new GoalResult(
                goalPlan,
                resultType,
                message
        );

        goalResultRepository.save(result);
    }

    /**
     * 결과 조회 (최종 버전)
     */
    @Transactional(readOnly = true)
    public GoalResultResponse getResult(GoalPlan goalPlan) {

        GoalResult result = goalResultRepository.findByGoalPlan(goalPlan)
                .orElseThrow(() -> new RuntimeException("결과 없음"));

        CharacterResponse character =
                characterService.getCurrentCharacter(goalPlan.getUser().getId());

        return new GoalResultResponse(
                result.getGoalPlan().getId(), // ⭐ 반드시 포함
                result.getResultType(),
                result.getMessage(),
                result.getCreatedAt(),
                character.getImageUrl(),
                character.getLevel()
        );
    }

    /**
     * 진행률 계산
     */
    private double calculateProgress(GoalPlan goalPlan) {
        long total = dailyTaskRepository.countByGoalPlan(goalPlan);
        long completed = dailyTaskRepository.countByGoalPlanAndCompletedTrue(goalPlan);

        if (total == 0) return 0;

        return (double) completed / total * 100;
    }

    /**
     * 결과 판정
     */
    private ResultType calculateResult(double progress) {
        if (progress >= 100) return ResultType.SUCCESS;
        if (progress >= 30) return ResultType.PARTIAL;
        return ResultType.FAILED;
    }

    /**
     * 메시지 생성
     */
    private static final Random random = new Random();

    private String generateMessage(ResultType resultType) {
        return switch (resultType) {
            case SUCCESS -> getRandomMessage(List.of(
                    "목표 달성! 축하합니다 🎓",
                    "해냈네요! 정말 대단해요 🎉",
                    "완벽한 결과! 스스로를 칭찬해 주세요 👏"
            ));
            case PARTIAL -> getRandomMessage(List.of(
                    "꾸준함이 가장 큰 힘입니다 💪",
                    "조금씩 나아가고 있어요 🌱",
                    "좋은 흐름이에요, 계속 이어가요 🔥"
            ));
            case FAILED -> getRandomMessage(List.of(
                    "다음엔 더 성장할 수 있어요 🙂",
                    "실패는 과정일 뿐이에요 🚀",
                    "이번 경험이 다음 성공의 발판이에요 💡"
            ));
        };
    }

    private String getRandomMessage(List<String> messages) {
        return messages.get(random.nextInt(messages.size()));
    }

    // 미확인 결과 목록 조회
    @Transactional(readOnly = true)
    public List<GoalResultResponse> getPendingResults(Long userId) {

        List<GoalResult> results = goalResultRepository
                .findByGoalPlan_User_IdAndIsSeenFalseOrderByCreatedAtAsc(userId.intValue());

        // ⭐ 한 번만 호출
        CharacterResponse character = characterService.getCurrentCharacter(userId.intValue());

        return results.stream()
                .map(result -> new GoalResultResponse(
                        result.getGoalPlan().getId(),
                        result.getResultType(),
                        result.getMessage(),
                        result.getCreatedAt(),
                        character.getImageUrl(),
                        character.getLevel()
                )).toList();
    }

    // 확인 처리
    @Transactional
    public void markAsSeen(Integer goalPlanId, Integer userId) {

        GoalResult result = goalResultRepository
                .findByGoalPlan_IdAndGoalPlan_User_Id(goalPlanId, userId)
                .orElseThrow(() -> new RuntimeException("결과 없음"));

        result.markAsSeen();
    }
}