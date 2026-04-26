package com.example.focusapp.dto;

public class ReminderResponse {
    private Long id;
    private Long goalPlanId;
    private String reminderTime;
    private Boolean active;

    public ReminderResponse(Long id, Long goalPlanId, String reminderTime, Boolean active) {
        this.id = id;
        this.goalPlanId = goalPlanId;
        this.reminderTime = reminderTime;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public Long getGoalPlanId() {
        return goalPlanId;
    }

    public String getReminderTime() {
        return reminderTime;
    }

    public Boolean getActive() {
        return active;
    }
}