package com.example.focusapp.controller;

import com.example.focusapp.dto.GoalPlanResponse;
import com.example.focusapp.dto.UpdateGoalRequest;
import com.example.focusapp.service.GoalPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
@CrossOrigin
public class GoalPlanController {

    private final GoalPlanService goalPlanService;

    @GetMapping("/users/{userId}")
    public ResponseEntity<List<GoalPlanResponse>> getGoalPlans(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(goalPlanService.getGoalPlans(userId));
    }

    @GetMapping("/users/{userId}/active")
    public ResponseEntity<List<GoalPlanResponse>> getActiveGoals(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(goalPlanService.getActiveGoals(userId));
    }

    @PatchMapping("/{goalId}")
    public ResponseEntity<GoalPlanResponse> updateGoal(
            @PathVariable Long goalId,
            @RequestBody UpdateGoalRequest request
    ) {
        return ResponseEntity.ok(goalPlanService.updateGoal(goalId, request));
    }

    @PatchMapping("/{goalId}/status")
    public ResponseEntity<GoalPlanResponse> updateStatus(
            @PathVariable Long goalId,
            @RequestParam String status
    ) {
        return ResponseEntity.ok(goalPlanService.updateStatus(goalId, status));
    }
}