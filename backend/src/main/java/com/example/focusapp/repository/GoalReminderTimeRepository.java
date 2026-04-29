package com.example.focusapp.repository;

import com.example.focusapp.entity.GoalReminderTime;
import com.example.focusapp.dto.ReminderPushTarget;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface GoalReminderTimeRepository extends JpaRepository<GoalReminderTime, Long> {

    List<GoalReminderTime> findByGoalPlanIdOrderByReminderTimeAsc(Long goalPlanId);

    Optional<GoalReminderTime> findByGoalPlanIdAndReminderTime(Long goalPlanId, String reminderTime);

    boolean existsByGoalPlanIdAndReminderTime(Long goalPlanId, String reminderTime);

    @Query("""
        SELECT new com.example.focusapp.dto.ReminderPushTarget(
            g.id,
            u.id,
            d.title,
            t.pushToken,
            r.id,
            r.nextTargetDate,
            c.alarmCycle
        )
        FROM GoalReminderTime r
        JOIN GoalPlan g ON r.goalPlanId = g.id
        JOIN User u ON g.user.id = u.id
        JOIN GoalDefinition d ON g.goalDefinition.id = d.id
        JOIN GoalConfig c ON g.id = c.goalPlan.id
        JOIN UserPushToken t ON t.userId = u.id
        JOIN DailyTask dt ON dt.goalPlan.id = g.id
        WHERE r.reminderTime = :nowTime
          AND r.nextTargetDate = :today
          AND r.active = true
          AND t.active = true
          AND dt.targetDate = :today
          AND dt.completed = false
          AND dt.routine IS NULL
          AND g.status = com.example.focusapp.entity.GoalStatus.ACTIVE
        GROUP BY
          g.id,
          u.id,
          d.title,
          t.pushToken,
          r.id,
          r.nextTargetDate,
          c.alarmCycle
    """)
    List<ReminderPushTarget> findPushTargets(
            @Param("nowTime") String nowTime,
            @Param("today") LocalDate today
    );

    @Modifying
    @Query("""
        UPDATE GoalReminderTime r
        SET r.nextTargetDate = :nextDate
        WHERE r.id = :reminderTimeId
    """)
    void updateNextTargetDate(
            @Param("reminderTimeId") Long reminderTimeId,
            @Param("nextDate") LocalDate nextDate
    );
}