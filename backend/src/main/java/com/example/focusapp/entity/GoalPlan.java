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

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "goal_definition_id", nullable = false)
    private GoalDefinition goalDefinition;

    @Column(name = "character_id")
    private Integer characterId;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "current_level", nullable = false)
    private Integer currentLevel = 1;

    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "goalPlan", cascade = CascadeType.ALL)
    private GoalConfig goalConfig;

    public Integer getId() { return id; }

    public GoalDefinition getGoalDefinition() {
        return goalDefinition;
    }
    public void setGoalConfig(GoalConfig goalConfig) {
        this.goalConfig = goalConfig;
        if(goalConfig != null){goalConfig.setGoalPlan(this);
        }
    }
    public Integer getGoalDefinitionId() {
        return goalDefinition != null ? goalDefinition.getId() : null;
    }

    public void setGoalDefinition(GoalDefinition goalDefinition) {
        this.goalDefinition = goalDefinition;
    }

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

    public GoalConfig getGoalConfig() {
        return goalConfig;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}