package com.example.focusapp.service;

import com.example.focusapp.dto.GoalCalendarResponse;
import com.example.focusapp.entity.GoalPlan;
import com.example.focusapp.repository.DailyTaskRepository;
import com.example.focusapp.repository.GoalPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalCalendarService {

    private final GoalPlanRepository goalPlanRepository;
    private final DailyTaskRepository dailyTaskRepository;

    public GoalCalendarResponse getCompletedDates(Long goalPlanId, int year, int month) {
        GoalPlan goalPlan = goalPlanRepository.findById(goalPlanId)
                .orElseThrow(() -> new IllegalArgumentException("Goal plan not found"));



        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1);

        List<java.sql.Date> dates = dailyTaskRepository.findCompletedDatesByGoalPlanId(
                goalPlanId, startDate, endDate
        );

        List<String> completedDates = dates.stream()
                .map(date -> date.toLocalDate().toString())
                .toList();

        String preferredEmoji = goalPlan.getGoalConfig() != null
                ? goalPlan.getGoalConfig().getPreferredEmoji()
                : "🌱";

        return new GoalCalendarResponse(
                goalPlanId,
                preferredEmoji,
                year,
                month,
                completedDates
        );
    }
}