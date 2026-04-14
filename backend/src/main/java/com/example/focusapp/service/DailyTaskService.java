package com.example.focusapp.service;

import com.example.focusapp.dto.DailyTaskResponse;
import com.example.focusapp.dto.MessageType;
import com.example.focusapp.dto.CreateDailyTaskRequest;
import com.example.focusapp.dto.UpdateDailyTaskRequest;
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
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class DailyTaskService {

    private final DailyTaskRepository dailyTaskRepository;
    private final GoalPlanRepository goalPlanRepository;
    private final GoalConfigRepository goalConfigRepository;
    private final Random random = new Random();

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

        GoalPlan goalPlan = dailyTask.getGoalPlan();

        int beforeLevel = goalPlan.getCurrentLevel(); // ⭐ 이전 레벨 저장

        dailyTask.setCompleted(!dailyTask.isCompleted());

        if (dailyTask.isCompleted()) {
            dailyTask.setCompletedAt(LocalDateTime.now());
        } else {
            dailyTask.setCompletedAt(null);
        }

        recalculateLevel(goalPlan);

        int afterLevel = goalPlan.getCurrentLevel();

        MessageResult result = generateMessage(
                dailyTask.isCompleted(),
                beforeLevel,
                afterLevel
        );

        return new DailyTaskResponse(
                dailyTask.getId(),
                goalPlan.getId(),
                dailyTask.getTitle(),
                dailyTask.isCompleted(),
                afterLevel,
                result.getMessage(),
                result.getType() // ⭐ 추가
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

    private static class MessageResult {
        private final String message;
        private final MessageType type;

        public MessageResult(String message, MessageType type) {
            this.message = message;
            this.type = type;
        }

        public String getMessage() {
            return message;
        }

        public MessageType getType() {
            return type;
        }
    }

    private MessageResult generateMessage(boolean completed, int beforeLevel, int afterLevel) {

        if (!completed) {
            return new MessageResult("괜찮아요, 다시 해봐요 🙂", MessageType.UNDO);
        }

        // ⭐ 레벨업
        if (afterLevel > beforeLevel) {
            return new MessageResult(
                    "레벨 " + afterLevel + " 달성! 성장하고 있어요 🚀",
                    MessageType.LEVEL_UP
            );
        }

        // ⭐ 일반 완료
        String[] messages = {
                "오늘도 한 걸음 전진했어요 🚀",
                "꾸준함이 가장 큰 힘이에요 💪",
                "좋아요! 계속 이어가요 🔥",
                "성장의 한 조각을 쌓았어요 ✨"
        };

        int idx = ThreadLocalRandom.current().nextInt(messages.length);

        return new MessageResult(messages[idx], MessageType.NORMAL);
    }

    @Transactional
    public DailyTaskResponse create(CreateDailyTaskRequest req) {
        GoalPlan goalPlan = goalPlanRepository.findById(req.getGoalPlanId())
                .orElseThrow(() -> new NotFoundException("GoalPlan 없음"));

        DailyTask task = new DailyTask();
        task.setGoalPlan(goalPlan);
        task.setTitle(req.getTitle());
        task.setCompleted(false);
        task.setTargetDate(LocalDate.now());

        dailyTaskRepository.save(task);

        recalculateLevel(goalPlan);

        return new DailyTaskResponse(
                task.getId(),
                goalPlan.getId(),
                task.getTitle(),
                task.isCompleted(),
                goalPlan.getCurrentLevel()
        );
    }
    @Transactional
    public DailyTaskResponse updateTitle(Integer id, String title) {
        DailyTask task = dailyTaskRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Task 없음"));

        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("제목은 비어 있을 수 없습니다");
        }

        task.setTitle(title.trim());

        return new DailyTaskResponse(
                task.getId(),
                task.getGoalPlan().getId(),
                task.getTitle(),
                task.isCompleted(),
                task.getGoalPlan().getCurrentLevel()
        );
    }

    @Transactional
    public void delete(Integer id) {
        DailyTask task = dailyTaskRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Task 없음"));

        GoalPlan goalPlan = task.getGoalPlan();

        dailyTaskRepository.delete(task);
        recalculateLevel(goalPlan);
    }

    @Transactional(readOnly = true)
    public List<DailyTask> getTodayTasks(GoalPlan goalPlan, LocalDate today) {
        return dailyTaskRepository.findByGoalPlanAndTargetDate(goalPlan, today);
    }
}
