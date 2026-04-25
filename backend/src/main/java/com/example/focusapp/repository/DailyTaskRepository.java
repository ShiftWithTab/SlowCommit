package com.example.focusapp.repository;

import com.example.focusapp.entity.DailyTask;
import com.example.focusapp.entity.GoalPlan;
import com.example.focusapp.entity.Routine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DailyTaskRepository extends JpaRepository<DailyTask, Long> {

    boolean existsByRoutineAndTargetDate(Routine routine, LocalDate targetDate);
    boolean existsByGoalPlanAndTargetDate(GoalPlan goalPlan, LocalDate targetDate);

    long countByGoalPlan(GoalPlan goalPlan);
    long countByGoalPlanAndCompletedTrue(GoalPlan goalPlan);

    List<DailyTask> findByGoalPlanOrderByTargetDateDesc(GoalPlan goalPlan);
    List<DailyTask> findByGoalPlanAndTargetDate(GoalPlan goalPlan, LocalDate date);
    List<DailyTask> findByRoutineAndTargetDate(Routine routine, LocalDate date);
    List<DailyTask> findByRoutineIdAndDeletedAtIsNull(Long routineId);

    @Query("""
    SELECT COUNT(dt) > 0
    FROM DailyTask dt
    WHERE dt.goalPlan = :goalPlan
    AND dt.targetDate = :date
    AND dt.routine IS NULL
    """)
    boolean existsGoalTaskOnly(
            @Param("goalPlan") GoalPlan goalPlan,
            @Param("date") LocalDate date
    );

    Optional<DailyTask> findTopByGoalPlanAndTargetDateLessThanEqualOrderByTargetDateDesc(
            GoalPlan goalPlan,
            LocalDate date
    );

    Optional<DailyTask> findTopByRoutineAndTargetDateLessThanEqualOrderByTargetDateDesc(
            Routine routine,
            LocalDate date
    );

    @Query(value = """
        SELECT dt.target_date
          FROM daily_tasks dt
         WHERE dt.goal_plan_id = :goalPlanId
           AND dt.target_date >= :startDate
           AND dt.target_date < :endDate
         GROUP BY dt.goal_plan_id, dt.target_date
        HAVING COUNT(*) = SUM(CASE WHEN dt.completed = 1 THEN 1 ELSE 0 END)
         ORDER BY dt.target_date
        """, nativeQuery = true)
    List<java.sql.Date> findCompletedDatesByGoalPlanId(
            @Param("goalPlanId") Long goalPlanId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}