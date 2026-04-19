package com.example.focusapp.repository;

import com.example.focusapp.entity.DailyTask;
import com.example.focusapp.entity.GoalPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DailyTaskRepository extends JpaRepository<DailyTask, Long> {
    boolean existsByGoalPlanAndTargetDate(GoalPlan goalPlan, LocalDate targetDate);
    boolean existsByGoalPlanIdAndTargetDate(Long goalPlanId, LocalDate targetDate);
    long countByGoalPlan(GoalPlan goalPlan);
    long countByGoalPlanAndCompletedTrue(GoalPlan goalPlan);

    List<DailyTask> findByGoalPlanOrderByTargetDateDesc(GoalPlan goalPlan);
    List<DailyTask> findByGoalPlanAndTargetDate(GoalPlan goalPlan, LocalDate date);

    Optional<DailyTask> findFirstByGoalPlanAndTargetDateLessThanEqualOrderByTargetDateDesc(
            GoalPlan goalPlan,
            LocalDate today
    );

    Optional<DailyTask> findTopByGoalPlanAndTargetDateLessThanEqualOrderByTargetDateDesc(
            GoalPlan goalPlan,
            LocalDate date
    );
    @Query(value = """
        SELECT dt.target_date
          FROM daily_tasks dt
         WHERE dt.goal_plan_id  = :goalPlanId
         AND dt.target_date >= :startDate
         AND dt.target_date < :endDate
         GROUP BY dt.goal_plan_id,target_date
        HAVING COUNT(*) = SUM(CASE WHEN dt.completed = 1 THEN 1 ELSE 0 END)
         ORDER BY dt.target_date
        """, nativeQuery = true)
    List<java.sql.Date> findCompletedDatesByGoalPlanId(
            @Param("goalPlanId") Long goalPlanId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}