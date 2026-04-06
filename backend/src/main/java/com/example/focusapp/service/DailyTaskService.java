package com.example.focusapp.service;

import com.example.focusapp.dto.DailyTaskResponse;
import com.example.focusapp.entity.DailyTask;
import com.example.focusapp.entity.GoalConfig;
import com.example.focusapp.entity.GoalPlan;
import com.example.focusapp.repository.DailyTaskRepository;
import com.example.focusapp.repository.GoalPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DailyTaskService {

    private final DailyTaskRepository dailyTaskRepository;
    private final GoalPlanRepository goalPlanRepository;

    @Transactional
    public void generateTodayTask(GoalPlan goalPlan) {
        LocalDate today = LocalDate.now();

        if (shouldGenerate(goalPlan, today)
                && !dailyTaskRepository.existsByGoalPlanAndTargetDate(goalPlan, today)) {

            dailyTaskRepository.save(new DailyTask(goalPlan, today));
        }
    }

    public DailyTask getActiveTask(GoalPlan goalPlan, LocalDate today) {
        return dailyTaskRepository
                .findFirstByGoalPlanAndTargetDateLessThanEqualOrderByTargetDateDesc(goalPlan, today)
                .orElseThrow(() -> new RuntimeException("활성 DailyTask 없음"));
    }

    @Transactional
    public DailyTaskResponse toggle(Long id) {
        DailyTask dailyTask = dailyTaskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DailyTask 없음"));

        dailyTask.setCompleted(!dailyTask.isCompleted());

        if (dailyTask.isCompleted()) {
            dailyTask.setCompletedAt(LocalDateTime.now());
        } else {
            dailyTask.setCompletedAt(null);
        }

        dailyTaskRepository.save(dailyTask);

        return new DailyTaskResponse(
                dailyTask.getId(),
                dailyTask.getGoalPlan().getId(),
                dailyTask.getGoalPlan().getGoalDefinition().getTitle(),
                dailyTask.isCompleted()
        );
    }

    @Transactional
    @Scheduled(cron = "0 0 0 * * *")
    public void generateDailyTasks() {
        LocalDate today = LocalDate.now();

        List<GoalPlan> goalPlans = goalPlanRepository.findAll();

        for (GoalPlan goalPlan : goalPlans) {
            if (shouldGenerate(goalPlan, today)
                    && !dailyTaskRepository.existsByGoalPlanAndTargetDate(goalPlan, today)) {

                dailyTaskRepository.save(new DailyTask(goalPlan, today));
            }
        }
    }

    private boolean shouldGenerate(GoalPlan goalPlan, LocalDate today) {
        GoalConfig goalConfig = goalPlan.getGoalConfig();

        if (goalConfig == null) {
            return false;
        }

        if (today.isBefore(goalPlan.getStartDate()) || today.isAfter(goalPlan.getEndDate())) {
            return false;
        }

        if (goalConfig.getAlarmCycle() <= 0) {
            return false;
        }

        long diff = ChronoUnit.DAYS.between(goalPlan.getStartDate(), today);

        return diff % goalConfig.getAlarmCycle() == 0;
    }
}