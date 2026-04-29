package com.example.focusapp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDate;
@Getter
@AllArgsConstructor
public class ReminderPushTarget {
    private Long goalPlanId;
    private Long userId;
    private String goalTitle;
    private String pushToken;
    private Long reminderTimeId;
    private LocalDate nextTargetDate;
    private Integer alarmCycle;
}