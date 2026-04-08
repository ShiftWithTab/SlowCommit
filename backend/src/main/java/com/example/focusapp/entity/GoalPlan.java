package com.example.focusapp.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "goal_plans")
public class GoalPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "goal_definition_id", nullable = false)
    private Integer goalDefinitionId;

    @Column(name = "character_id")
    private Integer characterId;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "current_level", nullable = false)
    private Integer currentLevel;

    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "goal_definition_id", insertable = false, updatable = false)
    private GoalDefinition goalDefinition;

    @OneToOne
    @JoinColumn(
            name = "id",
            referencedColumnName = "goal_plan_id",
            insertable = false,
            updatable = false
    )
    private GoalConfig goalConfig;

    public Integer getId() { return id; }
    public Integer getGoalDefinitionId() { return goalDefinitionId; }
    public void setGoalDefinitionId(Integer goalDefinitionId) { this.goalDefinitionId = goalDefinitionId; }
    public Integer getCharacterId() { return characterId; }
    public void setCharacterId(Integer characterId) { this.characterId = characterId; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public Integer getCurrentLevel() { return currentLevel; }
    public void setCurrentLevel(Integer currentLevel) { this.currentLevel = currentLevel; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public GoalDefinition getGoalDefinition() {
        return goalDefinition;
    }
    public GoalConfig getGoalConfig() {
        return goalConfig;
    }
}
