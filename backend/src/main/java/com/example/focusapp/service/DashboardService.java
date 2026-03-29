package com.example.focusapp.service;

import com.example.focusapp.dto.DashboardResponse;
import com.example.focusapp.repository.TaskRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {
    private final TaskRepository taskRepository;

    public DashboardService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public DashboardResponse getSummary() {
        long total = taskRepository.count();
        long completed = taskRepository.findAll().stream().filter(task -> task.isCompleted()).count();
        return new DashboardResponse(49, completed, total, "네이버, 카카오 가즈아!");
    }
}
