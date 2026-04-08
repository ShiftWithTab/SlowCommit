package com.example.focusapp.repository;

import com.example.focusapp.entity.GoalPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface GoalPlanRepository extends JpaRepository<GoalPlan, Integer> {

    List<GoalPlan> findByStartDateLessThanEqualAndEndDateGreaterThanEqual(
            LocalDate today1,
            LocalDate today2
    );
}