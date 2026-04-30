package com.example.focusapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PushTokenRequest {
    private Long userId;
    private String pushToken;
}