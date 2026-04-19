package com.example.focusapp.repository;

import com.example.focusapp.entity.GoalPlan;
import com.example.focusapp.entity.GoalResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GoalResultRepository extends JpaRepository<GoalResult, Long> {

    boolean existsByGoalPlan_Id(Long goalPlanId);
    Optional<GoalResult> findByGoalPlan_Id(Long goalPlanId);
    Optional<GoalResult> findByGoalPlan_IdAndGoalPlan_User_Id(Long goalPlanId, Long userId);
    List<GoalResult> findByGoalPlan_User_IdAndIsSeenFalseOrderByCreatedAtAsc(Long userId);
}