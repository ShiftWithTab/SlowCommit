package com.example.focusapp.service;

import com.example.focusapp.dto.DailyTaskResponse;
import com.example.focusapp.entity.DailyTask;
import com.example.focusapp.entity.GoalConfig;
import com.example.focusapp.entity.GoalPlan;
import com.example.focusapp.exception.NotFoundException;
import com.example.focusapp.repository.DailyTaskRepository;
import com.example.focusapp.repository.GoalPlanRepository;
import com.example.focusapp.repository.GoalConfigRepository;
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
public class DailyTaskService {

    private final DailyTaskRepository dailyTaskRepository;
    private final GoalPlanRepository goalPlanRepository;
    private final GoalConfigRepository goalConfigRepository;

    /**
     * 온보딩 직후 전체 기간 task 생성
     */
    @Transactional
    public void generateInitialTasks(GoalPlan goalPlan) {
        System.out.println("🔥 generateInitialTasks 시작 goalPlanId=" + goalPlan.getId());

        GoalConfig config = goalConfigRepository.findByGoalPlan(goalPlan)
                .orElseThrow(() -> new RuntimeException("GoalConfig 없음"));

        LocalDate date = goalPlan.getStartDate();

        while (!date.isAfter(goalPlan.getEndDate())) {
            if (!dailyTaskRepository.existsByGoalPlanAndTargetDate(goalPlan, date)) {
                DailyTask task = new DailyTask();
                task.setGoalPlan(goalPlan);
                task.setTargetDate(date);
                task.setCompleted(false);
                task.setTitle(goalPlan.getGoalDefinition().getTitle());

                dailyTaskRepository.save(task);

                System.out.println("✅ task 생성: " + date);
            }

            date = date.plusDays(config.getAlarmCycle());
        }
    }

    /**
     * 오늘 활성 task 조회
     */
    @Transactional(readOnly = true)
    public DailyTask getActiveTask(GoalPlan goalPlan, LocalDate today) {
        return dailyTaskRepository
                .findTopByGoalPlanAndTargetDateLessThanEqualOrderByTargetDateDesc(goalPlan, today)
                .orElseThrow(() -> new NotFoundException("활성 DailyTask 없음"));
    }
    /**
     * 완료 토글
     */
    @Transactional
    public DailyTaskResponse toggle(Integer id) {
        DailyTask dailyTask = dailyTaskRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("DailyTask 없음"));

        dailyTask.setCompleted(!dailyTask.isCompleted());

        if (dailyTask.isCompleted()) {
            dailyTask.setCompletedAt(LocalDateTime.now());
        } else {
            dailyTask.setCompletedAt(null);
        }

        GoalPlan goalPlan = dailyTask.getGoalPlan();
        recalculateLevel(goalPlan);

        return new DailyTaskResponse(
                dailyTask.getId(),
                goalPlan.getId(),
                dailyTask.getTitle(),
                dailyTask.isCompleted(),
                goalPlan.getCurrentLevel()
        );
    }

    /**
     * 매일 자정 누락 task 생성
     */
    @Transactional
    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
    public void generateDailyTasks() {
        LocalDate today = LocalDate.now();

        List<GoalPlan> goalPlans =
                goalPlanRepository.findByStartDateLessThanEqualAndEndDateGreaterThanEqual(today, today);

        for (GoalPlan goalPlan : goalPlans) {
            if (shouldGenerate(goalPlan, today)
                    && !dailyTaskRepository.existsByGoalPlanAndTargetDate(goalPlan, today)) {

                DailyTask task = new DailyTask();
                task.setGoalPlan(goalPlan);
                task.setTargetDate(today);
                task.setCompleted(false);
                task.setTitle(goalPlan.getGoalDefinition().getTitle());

                dailyTaskRepository.save(task);
                System.out.println("✅ scheduler task 생성 goalPlanId=" + goalPlan.getId());
            }
        }
    }

    /**
     * 생성 주기 판단
     */
    private boolean shouldGenerate(GoalPlan goalPlan, LocalDate today) {
        GoalConfig goalConfig = goalPlan.getGoalConfig();

        if (goalConfig == null) return false;

        if (today.isBefore(goalPlan.getStartDate()) || today.isAfter(goalPlan.getEndDate())) {
            return false;
        }

        if (goalConfig.getAlarmCycle() <= 0) {
            return false;
        }

        long diff = ChronoUnit.DAYS.between(goalPlan.getStartDate(), today);

        return diff % goalConfig.getAlarmCycle() == 0;
    }

    /**
     * 레벨 재계산
     */
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