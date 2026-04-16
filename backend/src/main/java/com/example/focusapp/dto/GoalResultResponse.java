package com.example.focusapp.dto;

import com.example.focusapp.entity.ResultType;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class GoalResultResponse {

    private Long goalPlanId;
    private ResultType resultType;
    private String message;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    private String imageUrl;
    private int level;
    private String goalTitle;
}