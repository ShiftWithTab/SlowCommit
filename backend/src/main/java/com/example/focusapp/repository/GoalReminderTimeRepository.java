package com.example.focusapp.repository;

import com.example.focusapp.entity.GoalReminderTime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import com.example.focusapp.dto.ReminderPushTarget;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface GoalReminderTimeRepository extends JpaRepository<GoalReminderTime, Long> {

    List<GoalReminderTime> findByGoalPlanIdOrderByReminderTimeAsc(Long goalPlanId);

    Optional<GoalReminderTime> findByGoalPlanIdAndReminderTime(Long goalPlanId, String reminderTime);
    boolean existsByGoalPlanIdAndReminderTime(Long goalPlanId, String reminderTime);
    @Query("""
        SELECT new com.example.focusapp.dto.ReminderPushTarget(
            g.id,
            u.id,
            d.title,
            t.pushToken
        )
        FROM GoalReminderTime r
        JOIN GoalPlan g ON r.goalPlanId = g.id
        JOIN User u ON g.user.id = u.id
        JOIN GoalDefinition d ON g.goalDefinition.id = d.id
        JOIN GoalConfig c ON g.id = c.goalPlan.id
        JOIN UserPushToken t ON t.userId = u.id
       WHERE r.reminderTime = :nowTime
         AND r.active = true
         AND t.active = true
         AND g.status = com.example.focusapp.entity.GoalStatus.ACTIVE
    """)
    List<ReminderPushTarget> findPushTargets(@Param("nowTime") String nowTime);

}