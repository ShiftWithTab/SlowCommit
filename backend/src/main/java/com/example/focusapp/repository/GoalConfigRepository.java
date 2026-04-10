package com.example.focusapp.repository;

import com.example.focusapp.entity.GoalConfig;
import com.example.focusapp.entity.GoalPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GoalConfigRepository extends JpaRepository<GoalConfig, Integer> {
    Optional<GoalConfig> findByGoalPlan(GoalPlan goalPlan);
}