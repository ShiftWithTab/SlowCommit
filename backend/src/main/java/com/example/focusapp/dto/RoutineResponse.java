package com.example.focusapp.dto;

import com.example.focusapp.entity.Routine;

public record RoutineResponse(
        Long id,
        String title
) {
    public static RoutineResponse from(Routine r) {
        return new RoutineResponse(r.getId(), r.getTitle());
    }
}