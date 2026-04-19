package com.example.focusapp.controller;

import com.example.focusapp.dto.GoalResultResponse;
import com.example.focusapp.service.GoalResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/goals")
public class GoalResultController {

    private final GoalResultService goalResultService;

    // ⭐ 하나씩 가져오기 (추천)
    @GetMapping("/result/next")
    public GoalResultResponse getNext(@RequestParam Long userId) {
        return goalResultService.getNextPendingResult(userId);
    }

    // ⭐ 리스트 조회 (옵션)
    @GetMapping("/result/pending")
    public List<GoalResultResponse> getPending(@RequestParam Long userId) {
        return goalResultService.getPendingResults(userId);
    }

    // ⭐ 확인 처리
    @PatchMapping("/{goalPlanId}/result/seen")
    public void markAsSeen(
            @PathVariable Long goalPlanId,
            @RequestParam Long userId
    ) {
        goalResultService.markAsSeen(goalPlanId, userId);
    }
}