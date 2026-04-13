package com.example.focusapp.dto;

import java.time.LocalDate;

public class SetupRequest {
    private Integer userId;
    private String goalTitle;
    private String motto;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer alarmCycle;
    private String preferredEmoji;
    private Integer characterId;
    private Integer goalDefinitionId;

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getGoalTitle() { return goalTitle; }
    public void setGoalTitle(String goalTitle) { this.goalTitle = goalTitle; }

    public Integer getGoalDefinitionId() { return goalDefinitionId; }
    public void setGoalDefinitionId(Integer goalDefinitionId) { this.goalDefinitionId = goalDefinitionId; }

    public String getMotto() { return motto; }
    public void setMotto(String motto) { this.motto = motto; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public Integer getAlarmCycle() { return alarmCycle; }
    public void setAlarmCycle(Integer alarmCycle) { this.alarmCycle = alarmCycle; }

    public String getPreferredEmoji() { return preferredEmoji; }
    public void setPreferredEmoji(String preferredEmoji) { this.preferredEmoji = preferredEmoji; }

    public Integer getCharacterId() { return characterId; }
    public void setCharacterId(Integer characterId) { this.characterId = characterId; }
}