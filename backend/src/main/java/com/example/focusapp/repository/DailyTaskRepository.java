package com.example.focusapp.repository;

import com.example.focusapp.entity.DailyTask;
import com.example.focusapp.entity.GoalPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface DailyTaskRepository extends JpaRepository<DailyTask, Long> {

    boolean existsByGoalPlanAndTargetDate(GoalPlan goalPlan, LocalDate targetDate);

    Optional<DailyTask> findFirstByGoalPlanAndTargetDateLessThanEqualOrderByTargetDateDesc(
            GoalPlan goalPlan,
            LocalDate today
    );
}