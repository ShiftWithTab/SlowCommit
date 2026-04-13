package com.example.focusapp.dto;

import java.time.LocalDate;

public class SetupResponse {
    private Integer goalPlanId;
    private Integer userId;
    private Integer goalDefinitionId;
    private Integer characterId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private String message;
    private String title;


    public SetupResponse(Integer goalPlanId, Integer userId, Integer goalDefinitionId,
                         Integer characterId, LocalDate startDate, LocalDate endDate,
                         String status, String title, String message) {
        this.goalPlanId = goalPlanId;
        this.userId = userId;
        this.goalDefinitionId = goalDefinitionId;
        this.characterId = characterId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.title = title;
        this.message = message;
    }

    public Integer getGoalPlanId() {
        return goalPlanId;
    }

    public Integer getUserId() {
        return userId;
    }

    public Integer getGoalDefinitionId() {
        return goalDefinitionId;
    }

    public Integer getCharacterId() {
        return characterId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public String getStatus() {
        return status;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

}