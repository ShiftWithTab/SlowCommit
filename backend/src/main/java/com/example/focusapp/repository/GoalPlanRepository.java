package com.example.focusapp.repository;

import com.example.focusapp.entity.GoalPlan;
import com.example.focusapp.entity.GoalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.time.LocalDate;
import java.util.List;

public interface GoalPlanRepository extends JpaRepository<GoalPlan, Long> {

    List<GoalPlan> findByStartDateLessThanEqualAndEndDateGreaterThanEqual(
            LocalDate today1,
            LocalDate today2
    );
    List<GoalPlan> findByUserId(Long userId);
    Optional<GoalPlan> findTopByUserIdOrderByIdDesc(Long userId);
    Optional<GoalPlan> findTopByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<GoalPlan> findActiveByUserId(Long userId);
    List<GoalPlan> findByEndDate(LocalDate endDate);
    List<GoalPlan> findByUserIdAndStatus(Long userId, GoalStatus status);
}