package com.example.focusapp.service;

import com.example.focusapp.dto.DailyTaskResponse;
import com.example.focusapp.entity.DailyTask;
import com.example.focusapp.entity.GoalConfig;
import com.example.focusapp.entity.GoalPlan;
import com.example.focusapp.repository.DailyTaskRepository;
import com.example.focusapp.repository.GoalPlanRepository;
import com.example.focusapp.exception.NotFoundException;
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
                .orElseThrow(() -> new NotFoundException("활성 DailyTask 없음"));
    }

    @Transactional
    public DailyTaskResponse toggle(Long id) {
        DailyTask dailyTask = dailyTaskRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("DailyTask 없음"));

        dailyTask.setCompleted(!dailyTask.isCompleted());

        if (dailyTask.isCompleted()) {
            dailyTask.setCompletedAt(LocalDateTime.now());
        } else {
            dailyTask.setCompletedAt(null);
        }

        // dailyTaskRepository.save(dailyTask);

        GoalPlan goalPlan = dailyTask.getGoalPlan();
        recalculateLevel(goalPlan);

        return new DailyTaskResponse(
                dailyTask.getId(),
                dailyTask.getGoalPlan().getId(),
                dailyTask.getGoalPlan().getGoalDefinition().getTitle(),
                dailyTask.isCompleted(),
                goalPlan.getCurrentLevel()
        );
    }

    @Transactional
    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
    public void generateDailyTasks() {
        LocalDate today = LocalDate.now();

        List<GoalPlan> goalPlans =
                goalPlanRepository.findByStartDateLessThanEqualAndEndDateGreaterThanEqual(today, today);

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

    private void recalculateLevel(GoalPlan goalPlan) {
        long total = dailyTaskRepository.countByGoalPlan(goalPlan);
        long completed = dailyTaskRepository.countByGoalPlanAndCompletedTrue(goalPlan);

        if (total == 0) {
            goalPlan.setCurrentLevel(1);
            return;
        }

        int level = (int) Math.round((double) completed / total * 10);

        if (level < 1) level = 1;
        if (level > 10) level = 10;

        goalPlan.setCurrentLevel(level);
    }
}