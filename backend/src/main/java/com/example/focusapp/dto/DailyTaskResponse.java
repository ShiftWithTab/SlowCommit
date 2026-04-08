package com.example.focusapp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DailyTaskResponse {

    private Long id;
    private Integer goalPlanId;
    private String title;
    private boolean completed;
    private Integer currentLevel;
}