package com.example.focusapp.dto;

import java.time.LocalDate;

public class SetupResponse {
    private Long goalPlanId;
    private Long userId;
    private Long goalDefinitionId;
    private Long characterId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private String message;
    private String title;


    public SetupResponse(Long goalPlanId, Long userId, Long goalDefinitionId,
                         Long characterId, LocalDate startDate, LocalDate endDate,
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

    public Long getGoalPlanId() {
        return goalPlanId;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getGoalDefinitionId() {
        return goalDefinitionId;
    }

    public Long getCharacterId() {
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