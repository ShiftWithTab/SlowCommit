package com.example.focusapp.dto;

public record DailyTaskResponse(
        Long dailyTaskId,
        Long taskId,
        String title,
        boolean completed
) {}