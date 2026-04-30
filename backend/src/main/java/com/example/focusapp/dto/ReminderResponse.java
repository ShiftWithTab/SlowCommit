package com.example.focusapp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReminderResponse {
    private Long id;
    private Long goalPlanId;
    private String reminderTime;
    private Boolean active;
}