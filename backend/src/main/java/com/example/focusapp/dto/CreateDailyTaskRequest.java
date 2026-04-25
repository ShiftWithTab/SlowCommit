package com.example.focusapp.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class CreateDailyTaskRequest {
    private Long goalPlanId;
    private Long routineId;
    private String title;
    private LocalDate targetDate;
}