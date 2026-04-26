package com.example.focusapp.repository;

import com.example.focusapp.entity.Routine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.focusapp.dto.RoutinePushTarget;
import java.time.LocalTime;
public interface RoutineRepository extends JpaRepository<Routine, Long> {
    List<Routine> findByGoalPlanId(Long goalPlanId);
    List<Routine> findByGoalPlanIdAndDeletedAtIsNull(Long goalPlanId);

    @Query("""
    SELECT new com.example.focusapp.dto.RoutinePushTarget(
        r.id,
        g.id,
        u.id,
        r.title,
        t.pushToken
    )
    FROM Routine r
    JOIN r.goalPlan g
    JOIN g.user u
    JOIN UserPushToken t ON t.userId = u.id
    WHERE r.time = :nowTime
      AND r.active = true
      AND r.deletedAt IS NULL
      AND t.active = true
      AND g.status = com.example.focusapp.entity.GoalStatus.ACTIVE
""")
    List<RoutinePushTarget> findRoutinePushTargets(@Param("nowTime") LocalTime nowTime);
}