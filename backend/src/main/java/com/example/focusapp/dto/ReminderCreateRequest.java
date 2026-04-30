package com.example.focusapp.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReminderCreateRequest {
    private Long goalPlanId;
    private String reminderTime;
}