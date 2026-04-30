package com.example.focusapp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class GoalPlanResponse {

    private Long id;
    private String title;
    private String emoji;
    private Long characterId;
    private String characterName;
    private boolean isActive;
    private String motto;
    private Integer alarmCycle;
    private LocalDate endDate;
}
