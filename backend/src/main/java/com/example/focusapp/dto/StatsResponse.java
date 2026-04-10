package com.example.focusapp.dto;

public record StatsResponse(
        int completedCount,
        int totalCount,
        int streak,
        int currentLevel
) {}