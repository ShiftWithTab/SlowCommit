package com.example.focusapp.controller;

import com.example.focusapp.dto.DailyTaskResponse;
import com.example.focusapp.entity.DailyTask;
import com.example.focusapp.entity.GoalPlan;
import com.example.focusapp.repository.GoalPlanRepository;
import com.example.focusapp.service.DailyTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/daily-tasks")
@RequiredArgsConstructor
public class DailyTaskController {

    private final DailyTaskService dailyTaskService;
    private final GoalPlanRepository goalPlanRepository;

    @GetMapping("/active/{goalPlanId}")
    public DailyTaskResponse getActiveTask(@PathVariable Integer goalPlanId) {
        GoalPlan goalPlan = goalPlanRepository.findById(goalPlanId)
                .orElseThrow(() -> new RuntimeException("goalPlan 없음: " + goalPlanId));

        DailyTask dailyTask = dailyTaskService.getActiveTask(goalPlan, LocalDate.now());

        return new DailyTaskResponse(
                dailyTask.getId(),
                dailyTask.getGoalPlan().getId(),
                dailyTask.getGoalPlan().getGoalDefinition().getTitle(),
                dailyTask.isCompleted(),
                goalPlan.getCurrentLevel()
        );
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<DailyTaskResponse> toggle(@PathVariable Long id) {
        return ResponseEntity.ok(dailyTaskService.toggle(id));
    }
}