package com.example.focusapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateDailyTaskRequest {
    private Integer goalPlanId;
    private String title;
}