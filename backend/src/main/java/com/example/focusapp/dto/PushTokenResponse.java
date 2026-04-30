package com.example.focusapp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PushTokenResponse {
    private Long id;
    private Long userId;
    private String pushToken;
    private Boolean active;
}