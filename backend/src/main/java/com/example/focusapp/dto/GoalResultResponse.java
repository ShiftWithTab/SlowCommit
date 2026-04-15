package com.example.focusapp.dto;

import com.example.focusapp.entity.ResultType;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GoalResultResponse {

    private ResultType resultType;
    private String message;
    private String createdAt;

    private String characterImageUrl;
    private int level;
}