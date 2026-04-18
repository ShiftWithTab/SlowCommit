package com.example.focusapp.controller;

import com.example.focusapp.dto.GoalCalendarResponse;
import com.example.focusapp.service.GoalCalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/goal-plans")
public class GoalCalendarController {

    private final GoalCalendarService goalCalendarService;

    @GetMapping("/{goalPlanId}/calendar")
    public ResponseEntity<GoalCalendarResponse> getCompletedDates(
            @PathVariable Long goalPlanId,
            @RequestParam int year,
            @RequestParam int month
    ) {
        return ResponseEntity.ok(
                goalCalendarService.getCompletedDates(goalPlanId, year, month)
        );
    }
}