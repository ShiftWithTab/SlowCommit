package com.example.focusapp.controller;

import com.example.focusapp.dto.CreateTaskRequest;
import com.example.focusapp.dto.TaskResponse;
import com.example.focusapp.service.TaskService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<TaskResponse> getTasks(@RequestParam(required = false) Long categoryId) {
        return taskService.getTasks(categoryId);
    }

    @PostMapping
    public TaskResponse createTask(@RequestBody CreateTaskRequest request) {
        return taskService.createTask(request);
    }

    @PatchMapping("/{taskId}/toggle")
    public TaskResponse toggleTask(@PathVariable Long taskId) {
        return taskService.toggleTask(taskId);
    }
}
