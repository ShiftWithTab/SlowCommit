package com.example.focusapp.dto;

import lombok.Getter;

@Getter
public class DailyTaskResponse {

    private Long id;
    private Long goalPlanId;
    private Long routineId;
    private String title;
    private boolean completed;
    private Integer currentLevel;
    private String message;
    private MessageType messageType;

    public DailyTaskResponse(Long id,
                             Long goalPlanId,
                             Long routineId,
                             String title,
                             boolean completed,
                             Integer currentLevel) {
        this.id = id;
        this.goalPlanId = goalPlanId;
        this.routineId = routineId;
        this.title = title;
        this.completed = completed;
        this.currentLevel = currentLevel;
        this.message = null;
        this.messageType = null;
    }

    public DailyTaskResponse(Long id,
                             Long goalPlanId,
                             Long routineId,
                             String title,
                             boolean completed,
                             Integer currentLevel,
                             String message,
                             MessageType messageType) {
        this.id = id;
        this.goalPlanId = goalPlanId;
        this.routineId = routineId;
        this.title = title;
        this.completed = completed;
        this.currentLevel = currentLevel;
        this.message = message;
        this.messageType = messageType;
    }
}