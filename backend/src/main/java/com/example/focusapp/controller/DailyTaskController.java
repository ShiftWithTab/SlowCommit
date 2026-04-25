package com.example.focusapp.controller;

import com.example.focusapp.dto.DailyTaskResponse;
import com.example.focusapp.dto.CreateDailyTaskRequest;
import com.example.focusapp.dto.UpdateDailyTaskRequest;
import com.example.focusapp.entity.DailyTask;
import com.example.focusapp.entity.GoalPlan;
import com.example.focusapp.repository.GoalPlanRepository;
import com.example.focusapp.service.DailyTaskService;
import com.example.focusapp.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/daily-tasks")
@RequiredArgsConstructor
public class DailyTaskController {

    private final DailyTaskService dailyTaskService;
    private final GoalPlanRepository goalPlanRepository;

    @GetMapping("/active/{goalPlanId}")
    public List<DailyTaskResponse> getTasksByDate(
            @PathVariable Long goalPlanId,
            @RequestParam String date
    ) {
        GoalPlan goalPlan = goalPlanRepository.findById(goalPlanId)
                .orElseThrow(() -> new NotFoundException("GoalPlan 없음"));

        LocalDate targetDate = LocalDate.parse(date);

        List<DailyTask> tasks =
                dailyTaskService.getTodayTasks(goalPlan, targetDate);

        return tasks.stream()
                .map(task -> new DailyTaskResponse(
                        task.getId(),
                        goalPlan.getId(),
                        task.getRoutine() != null ? task.getRoutine().getId() : null,
                        task.getTitle(),
                        task.isCompleted(),
                        goalPlan.getCurrentLevel()
                ))
                .toList();
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<DailyTaskResponse> toggle(@PathVariable Long id) {
        return ResponseEntity.ok(dailyTaskService.toggle(id));
    }

    @PostMapping
    public ResponseEntity<DailyTaskResponse> create(
            @RequestBody CreateDailyTaskRequest req
    ) {
        return ResponseEntity.ok(
                dailyTaskService.create(req)
        );
    }

    @PatchMapping("/{id}")
    public ResponseEntity<DailyTaskResponse> updateTitle(
            @PathVariable Long id,
            @RequestBody UpdateDailyTaskRequest req
    ) {
        return ResponseEntity.ok(
                dailyTaskService.updateTitle(id, req.getTitle())
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        dailyTaskService.delete(id);
        return ResponseEntity.ok().build();
    }
}