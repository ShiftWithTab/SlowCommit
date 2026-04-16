package com.example.focusapp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DailyTaskResponse {

    private Long id;
    private Long goalPlanId;
    private String title;
    private boolean completed;
    private Integer currentLevel;
    private String message;
    private MessageType messageType;

    public DailyTaskResponse(Long id, Long goalPlanId, String title,
                             boolean completed, Integer currentLevel) {
        this.id = id;
        this.goalPlanId = goalPlanId;
        this.title = title;
        this.completed = completed;
        this.currentLevel = currentLevel;
        this.message = null;
        this.messageType = null;
    }
}