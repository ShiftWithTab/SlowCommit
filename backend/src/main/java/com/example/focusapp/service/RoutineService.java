package com.example.focusapp.service;

import com.example.focusapp.dto.DailyTaskResponse;
import com.example.focusapp.dto.CreateRoutineRequest;
import com.example.focusapp.dto.MessageType;
import com.example.focusapp.dto.CreateDailyTaskRequest;
import com.example.focusapp.dto.UpdateDailyTaskRequest;
import com.example.focusapp.dto.RoutineResponse;
import com.example.focusapp.entity.DailyTask;
import com.example.focusapp.entity.GoalPlan;
import com.example.focusapp.entity.Routine;
import com.example.focusapp.exception.NotFoundException;
import com.example.focusapp.repository.DailyTaskRepository;
import com.example.focusapp.repository.RoutineRepository;
import com.example.focusapp.repository.GoalPlanRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoutineService {

    private final RoutineRepository routineRepository;
    private final GoalPlanRepository goalPlanRepository;
    private final DailyTaskRepository dailyTaskRepository;

    @Transactional
    public void createRoutine(CreateRoutineRequest req) {
        if (req.getInterval() == null || req.getInterval() <= 0) {
            throw new IllegalArgumentException("interval은 1 이상이어야 합니다.");
        }

        GoalPlan goalPlan = goalPlanRepository.findById(req.getGoalPlanId())
                .orElseThrow(() -> new NotFoundException("GoalPlan 없음"));

        LocalDate finalEndDate = req.getEndDate() != null
                ? req.getEndDate()
                : goalPlan.getEndDate();

        Routine routine = new Routine();
        routine.setGoalPlan(goalPlan);
        routine.setTitle(req.getTitle());
        routine.setStartDate(req.getStartDate());
        routine.setEndDate(finalEndDate);
        routine.setInterval(req.getInterval());
        routine.setTime(req.getTime());
        routine.setNextTargetDate(LocalDate.now());
        routineRepository.save(routine);

        generateDailyTasksFromRoutine(routine);
    }

    private void generateDailyTasksFromRoutine(Routine routine) {

        LocalDate date = routine.getStartDate();
        int interval = routine.getInterval();
        if (interval <= 0) {
            interval = 1; // 최소 1일 보장
        }
        while (!date.isAfter(routine.getEndDate())) {

            boolean exists = dailyTaskRepository
                    .existsByRoutineAndTargetDate(routine, date);

            if (!exists) {
                DailyTask task = new DailyTask();
                task.setGoalPlan(routine.getGoalPlan());
                task.setRoutine(routine); // 🔥 핵심 연결
                task.setTitle(routine.getTitle());
                task.setTargetDate(date);
                task.setCompleted(false);

                dailyTaskRepository.save(task);
            }

            date = date.plusDays(interval);
        }
    }

    public List<Routine> getRoutinesByGoal(Long goalPlanId) {

        return routineRepository.findByGoalPlanId(goalPlanId);
    }

    @Transactional
    public void deleteRoutine(Long id) {
        Routine routine = routineRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("루틴 없음"));

        routineRepository.delete(routine);

        List<DailyTask> tasks = dailyTaskRepository.findByRoutineIdAndDeletedAtIsNull(id);
        for (DailyTask task : tasks) {
            task.setDeletedAt(LocalDateTime.now());
        }
    }
}