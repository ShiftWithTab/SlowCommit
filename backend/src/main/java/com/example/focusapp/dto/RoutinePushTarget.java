package com.example.focusapp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import com.example.focusapp.dto.RoutinePushTarget;
import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class RoutinePushTarget {
    private Long routineId;
    private Long goalPlanId;
    private Long userId;
    private String routineTitle;
    private String pushToken;
    private LocalDate nextTargetDate;
    private Integer interval;
}