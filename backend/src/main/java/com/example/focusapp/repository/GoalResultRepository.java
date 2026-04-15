package com.example.focusapp.repository;

import com.example.focusapp.entity.GoalPlan;
import com.example.focusapp.entity.GoalResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface GoalResultRepository extends JpaRepository<GoalResult, Long> {

    boolean existsByGoalPlan(GoalPlan goalPlan);
    Optional<GoalResult> findByGoalPlan(GoalPlan goalPlan);
    List<GoalResult> findByGoalPlan_User_IdAndIsSeenFalseOrderByCreatedAtAsc(Integer userId);
    Optional<GoalResult> findByGoalPlan_IdAndGoalPlan_User_Id(Integer goalPlanId, Integer userId);
}