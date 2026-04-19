package com.example.focusapp.dto;

import java.util.List;

public class GoalCalendarResponse {
    private Long goalId;
    private String preferredEmoji;
    private int year;
    private int month;
    private List<String> completedDates;

public GoalCalendarResponse(Long goalId, String preferredEmoji, int year, int month, List<String> completedDates) {
    this.goalId = goalId;
    this.preferredEmoji = preferredEmoji;
    this.year = year;
    this.month = month;
    this.completedDates = completedDates;
}

    public Long getGoalId() {
        return goalId;
    }

    public String getPreferredEmoji() {
        return preferredEmoji;
    }

    public int getYear() {
        return year;
    }

    public int getMonth() {
        return month;
    }

    public List<String> getCompletedDates() {
        return completedDates;
    }
}