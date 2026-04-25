package com.example.focusapp.controller;

import com.example.focusapp.dto.StatsResponse;
import com.example.focusapp.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;

    @GetMapping
    public StatsResponse getStats(
            @RequestParam Long goalPlanId
    ) {
        return statsService.getStatsByGoalPlan(goalPlanId);
    }
}