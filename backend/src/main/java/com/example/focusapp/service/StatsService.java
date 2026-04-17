package com.example.focusapp.service;

import com.example.focusapp.dto.StatsResponse;
import com.example.focusapp.entity.DailyTask;
import com.example.focusapp.entity.GoalPlan;
import com.example.focusapp.exception.NotFoundException;
import com.example.focusapp.repository.DailyTaskRepository;
import com.example.focusapp.repository.GoalPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final GoalPlanRepository goalPlanRepository;
    private final DailyTaskRepository dailyTaskRepository;

    public StatsResponse getStats(Long userId) {
        GoalPlan goalPlan = goalPlanRepository
                .findTopByUserIdOrderByCreatedAtDesc(userId)
                .orElseThrow(() -> new IllegalArgumentException("목표 없음"));

        long completed = dailyTaskRepository.countByGoalPlanAndCompletedTrue(goalPlan);
        long total = dailyTaskRepository.countByGoalPlan(goalPlan);

        return new StatsResponse(
                (int) completed,
                (int) total,
                0,
                goalPlan.getCurrentLevel()
        );
    }
}