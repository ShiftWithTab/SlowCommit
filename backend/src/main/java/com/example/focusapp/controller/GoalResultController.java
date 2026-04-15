package com.example.focusapp.controller;

import com.example.focusapp.dto.GoalResultResponse;
import com.example.focusapp.entity.GoalPlan;
import com.example.focusapp.exception.NotFoundException;
import com.example.focusapp.repository.GoalPlanRepository;
import com.example.focusapp.service.GoalResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/goals")
public class GoalResultController {

    private final GoalPlanRepository goalPlanRepository;
    private final GoalResultService goalResultService;

    /**
     * 결과 조회 API
     *
     * ✔ 결과가 없으면 Lazy 생성
     */
    @GetMapping("/{goalPlanId}/result")
    public GoalResultResponse getResult(@PathVariable Integer goalPlanId) {

        GoalPlan goalPlan = goalPlanRepository.findById(goalPlanId)
                .orElseThrow(() -> new NotFoundException("GoalPlan 없음"));

        // ⭐ Lazy 생성 (스케줄러 실패 대비)
        goalResultService.createResult(goalPlan);

        return goalResultService.getResult(goalPlan);
    }

    @PostMapping("/test/result/{goalPlanId}")
    public GoalResultResponse forceCreateResult(@PathVariable Integer goalPlanId) {

        GoalPlan plan = goalPlanRepository.findById(goalPlanId)
                .orElseThrow(() -> new RuntimeException("GoalPlan 없음"));

        goalResultService.createResult(plan);

        return goalResultService.getResult(plan); // ⭐ 바로 반환
    }
}