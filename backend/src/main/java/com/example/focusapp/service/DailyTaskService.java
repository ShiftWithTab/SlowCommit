package com.example.focusapp.service;

import com.example.focusapp.dto.DailyTaskResponse;
import com.example.focusapp.entity.DailyTask;
import com.example.focusapp.entity.Task;
import com.example.focusapp.repository.DailyTaskRepository;
import com.example.focusapp.repository.TaskRepository;
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
    private final TaskRepository taskRepository;

    @Transactional
    public void generateTodayTask(Task task) {
        LocalDate today = LocalDate.now();

        if (shouldGenerate(task, today)
                && !dailyTaskRepository.existsByTaskAndTargetDate(task, today)) {

            dailyTaskRepository.save(new DailyTask(task, today));
        }
    }

    public DailyTask getActiveTask(Task task, LocalDate today) {
        return dailyTaskRepository
                .findFirstByTaskAndTargetDateLessThanEqualOrderByTargetDateDesc(task, today)
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

        return new DailyTaskResponse(
                dailyTask.getId(),
                dailyTask.getTask().getId(),
                dailyTask.getTask().getTitle(),
                dailyTask.isCompleted()
        );
    }

    @Transactional
    @Scheduled(cron = "0 0 0 * * *")
    public void generateDailyTasks() {
        LocalDate today = LocalDate.now();

        List<Task> tasks = taskRepository.findAll();

        for (Task task : tasks) {
            if (shouldGenerate(task, today)
                    && !dailyTaskRepository.existsByTaskAndTargetDate(task, today)) {

                dailyTaskRepository.save(new DailyTask(task, today));
            }
        }
    }

    private boolean shouldGenerate(Task task, LocalDate today) {
        if (today.isBefore(task.getStartDate())) {
            return false;
        }

        if (task.getRepeatCycle() <= 0) {
            return false;
        }

        long diff = ChronoUnit.DAYS.between(task.getStartDate(), today);
        return diff % task.getRepeatCycle() == 0;
    }
}