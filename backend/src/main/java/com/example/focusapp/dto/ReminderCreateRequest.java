package com.example.focusapp.dto;

public class ReminderCreateRequest {
    private Long goalPlanId;
    private String reminderTime;

    public Long getGoalPlanId() {
        return goalPlanId;
    }

    public void setGoalPlanId(Long goalPlanId) {
        this.goalPlanId = goalPlanId;
    }

    public String getReminderTime() {
        return reminderTime;
    }

    public void setReminderTime(String reminderTime) {
        this.reminderTime = reminderTime;
    }
}