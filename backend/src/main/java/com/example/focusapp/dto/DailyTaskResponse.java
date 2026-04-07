package com.example.focusapp.dto;

public record DailyTaskResponse(
        Long id,
        Integer goalPlanId,
        String title,
        boolean completed
) {}