package com.example.focusapp.repository;

import com.example.focusapp.entity.DailyTask;
import com.example.focusapp.entity.GoalPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyTaskRepository extends JpaRepository<DailyTask, Integer> {
    boolean existsByGoalPlanAndTargetDate(GoalPlan goalPlan, LocalDate targetDate);
    boolean existsByGoalPlanIdAndTargetDate(Integer goalPlanId, LocalDate targetDate);
    long countByGoalPlan(GoalPlan goalPlan);
    long countByGoalPlanAndCompletedTrue(GoalPlan goalPlan);

    List<DailyTask> findByGoalPlanOrderByTargetDateDesc(GoalPlan goalPlan);

    Optional<DailyTask> findFirstByGoalPlanAndTargetDateLessThanEqualOrderByTargetDateDesc(
            GoalPlan goalPlan,
            LocalDate today
    );

    Optional<DailyTask> findTopByGoalPlanAndTargetDateLessThanEqualOrderByTargetDateDesc(
            GoalPlan goalPlan,
            LocalDate date
    );
}