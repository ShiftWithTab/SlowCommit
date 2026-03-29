package com.example.focusapp.dto;

public record DashboardResponse(int streak, long completedCount, long totalCount, String message) {}
