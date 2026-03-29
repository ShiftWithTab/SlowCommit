package com.example.focusapp.dto;

import java.time.LocalDate;

public record TaskResponse(Long id, String title, boolean completed, Long categoryId, LocalDate dueDate) {}
