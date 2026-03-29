package com.example.focusapp.dto;

import java.time.LocalDate;

public record CreateTaskRequest(Long id, String title, Long categoryId, LocalDate dueDate) {}
