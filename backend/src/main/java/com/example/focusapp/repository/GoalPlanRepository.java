package com.example.focusapp.repository;

import com.example.focusapp.entity.GoalPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoalPlanRepository extends JpaRepository<GoalPlan, Integer> {
}