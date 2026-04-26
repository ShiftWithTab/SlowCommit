package com.example.focusapp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReminderPushTarget {
    private Long goalPlanId;
    private Long userId;
    private String goalTitle;
    private String pushToken;
}