package com.example.focusapp.service;

import com.example.focusapp.dto.CreateTaskRequest;
import com.example.focusapp.dto.TaskResponse;
import com.example.focusapp.entity.Category;
import com.example.focusapp.entity.Task;
import com.example.focusapp.repository.CategoryRepository;
import com.example.focusapp.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final CategoryRepository categoryRepository;

    public TaskService(TaskRepository taskRepository, CategoryRepository categoryRepository) {
        this.taskRepository = taskRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<TaskResponse> getTasks(Long categoryId) {
        List<Task> tasks = categoryId == null ? taskRepository.findAll() : taskRepository.findByCategoryId(categoryId);
        return tasks.stream()
                .sorted(Comparator.comparing(Task::getId))
                .map(this::toResponse)
                .toList();
    }

    public TaskResponse createTask(CreateTaskRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        Task task = new Task();
        task.setId(request.id());
        task.setTitle(request.title());
        task.setCompleted(false);
        task.setCategory(category);
        task.setDueDate(request.dueDate());

        return toResponse(taskRepository.save(task));
    }

    public TaskResponse toggleTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        task.setCompleted(!task.isCompleted());
        return toResponse(taskRepository.save(task));
    }

    private TaskResponse toResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.isCompleted(),
                task.getCategory().getId(),
                task.getDueDate()
        );
    }
}
