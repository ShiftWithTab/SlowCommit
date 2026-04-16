package com.example.focusapp.controller;

import com.example.focusapp.dto.GoalResultResponse;
import com.example.focusapp.entity.GoalPlan;
import com.example.focusapp.entity.User;
import com.example.focusapp.exception.NotFoundException;
import com.example.focusapp.repository.GoalPlanRepository;
import com.example.focusapp.service.GoalResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;


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
    public GoalResultResponse getResult(@PathVariable Long goalPlanId) {

        GoalPlan goalPlan = goalPlanRepository.findById(goalPlanId)
                .orElseThrow(() -> new NotFoundException("GoalPlan 없음"));

        // ⭐ Lazy 생성 (스케줄러 실패 대비)
        goalResultService.createResult(goalPlan);

        return goalResultService.getResult(goalPlan);
    }

    @GetMapping("/result/pending")
    public List<GoalResultResponse> getPendingResults(@RequestParam Long userId) {
        return goalResultService.getPendingResults(userId);
    }

    @PatchMapping("/{goalPlanId}/result/seen")
    public void markAsSeen(
            @PathVariable Long goalPlanId,
            @RequestParam Long userId
            // @AuthenticationPrincipal User user // Security 사용 하면 써야함.
    ) {
        goalResultService.markAsSeen(goalPlanId, userId);
    }

    @PostMapping("/test/result/{goalPlanId}")
    public GoalResultResponse forceCreateResult(@PathVariable Long goalPlanId) {

        GoalPlan plan = goalPlanRepository.findById(goalPlanId)
                .orElseThrow(() -> new RuntimeException("GoalPlan 없음"));

        goalResultService.createResult(plan);

        return goalResultService.getResult(plan); // ⭐ 바로 반환
    }
}