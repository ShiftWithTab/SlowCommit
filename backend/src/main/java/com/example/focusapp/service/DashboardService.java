package com.example.focusapp.service;

import com.example.focusapp.dto.DashboardResponse;
import com.example.focusapp.repository.GoalPlanRepository;
import com.example.focusapp.repository.DailyTaskRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final GoalPlanRepository goalPlanRepository;
    private final DailyTaskRepository dailyTaskRepository;

    public DashboardService(
            GoalPlanRepository goalPlanRepository,
            DailyTaskRepository dailyTaskRepository
    ) {
        this.goalPlanRepository = goalPlanRepository;
        this.dailyTaskRepository = dailyTaskRepository;
    }

    public DashboardResponse getSummary() {
        long total = goalPlanRepository.count();

        long completed = dailyTaskRepository
                .findAll()
                .stream()
                .filter(d -> d.isCompleted())
                .count();

        return new DashboardResponse(
                49,
                completed,
                total,
                "네이버, 카카오 가즈아!"
        );
    }
}