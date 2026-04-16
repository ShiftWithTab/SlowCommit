package com.example.focusapp.scheduler;

import com.example.focusapp.entity.GoalPlan;
import com.example.focusapp.repository.GoalPlanRepository;
import com.example.focusapp.service.GoalResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class GoalResultScheduler {

    private final GoalPlanRepository goalPlanRepository;
    private final GoalResultService goalResultService;

    @Scheduled(cron = "0 5 0 * * *", zone = "Asia/Seoul")
    public void generateResults() {

        LocalDate yesterday = LocalDate.now().minusDays(1);

        List<GoalPlan> plans = goalPlanRepository.findByEndDate(yesterday);

        for (GoalPlan plan : plans) {
            goalResultService.createResult(plan);
        }
    }
}