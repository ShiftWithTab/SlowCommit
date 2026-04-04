package com.example.focusapp.dto;

public class SetupResponse {
    private Integer goalDefinitionId;
    private Integer goalPlanId;
    private String message;

    public SetupResponse(Integer goalDefinitionId, Integer goalPlanId, String message) {
        this.goalDefinitionId = goalDefinitionId;
        this.goalPlanId = goalPlanId;
        this.message = message;
    }

    public Integer getGoalDefinitionId() { return goalDefinitionId; }
    public Integer getGoalPlanId() { return goalPlanId; }
    public String getMessage() { return message; }
}