package com.example.focusapp.controller;

import com.example.focusapp.dto.DailyTaskResponse;
import com.example.focusapp.entity.DailyTask;
import com.example.focusapp.entity.Task;
import com.example.focusapp.repository.TaskRepository;
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
    private final TaskRepository taskRepository;

    @GetMapping("/active/{taskId}")
    public DailyTaskResponse getActiveTask(@PathVariable Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("task 없음: " + taskId));

        DailyTask dailyTask = dailyTaskService.getActiveTask(task, LocalDate.now());

        return new DailyTaskResponse(
                dailyTask.getId(),
                dailyTask.getTask().getId(),
                dailyTask.getTask().getTitle(),
                dailyTask.isCompleted()
        );
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<DailyTaskResponse> toggle(@PathVariable Long id) {
        return ResponseEntity.ok(dailyTaskService.toggle(id));
    }
}