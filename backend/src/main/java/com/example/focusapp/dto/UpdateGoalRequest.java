package com.example.focusapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateGoalRequest {

    private String title;
    private String emoji;
    private Long characterId;
}