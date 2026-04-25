package com.example.focusapp.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
public class CreateRoutineRequest {
    private Long goalPlanId;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer interval;
    private LocalTime time;
}