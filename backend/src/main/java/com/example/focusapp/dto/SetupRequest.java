package com.example.focusapp.dto;

import java.time.LocalDate;

public class SetupRequest {
    private Long userId;
    private String goalTitle;
    private String motto;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer alarmCycle;
    private String preferredEmoji;
    private Long characterId;
    private Long goalDefinitionId;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getGoalTitle() { return goalTitle; }
    public void setGoalTitle(String goalTitle) { this.goalTitle = goalTitle; }

    public Long getGoalDefinitionId() { return goalDefinitionId; }
    public void setGoalDefinitionId(Long goalDefinitionId) { this.goalDefinitionId = goalDefinitionId; }

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

    public Long getCharacterId() { return characterId; }
    public void setCharacterId(Long characterId) { this.characterId = characterId; }
}