package com.example.focusapp.repository;

import com.example.focusapp.entity.GoalDefinition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoalDefinitionRepository extends JpaRepository<GoalDefinition, Long> {

    boolean existsByUserIdAndTitle(Long userId, String title);
    boolean existsByUserId(Long userId);
}