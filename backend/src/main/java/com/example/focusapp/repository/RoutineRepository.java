package com.example.focusapp.repository;

import com.example.focusapp.entity.Routine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RoutineRepository extends JpaRepository<Routine, Long> {
    List<Routine> findByGoalPlanId(Long goalPlanId);
    List<Routine> findByGoalPlanIdAndDeletedAtIsNull(Long goalPlanId);
}