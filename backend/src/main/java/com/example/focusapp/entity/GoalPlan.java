package com.example.focusapp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "goal_plans")
public class GoalPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "goal_definition_id", nullable = false)
    private GoalDefinition goalDefinition;

    @Column(name = "character_id")
    private Long characterId;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "current_level", nullable = false)
    private Integer currentLevel = 1;

    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "goalPlan", cascade = CascadeType.ALL)
    private GoalConfig goalConfig;

    public void setGoalConfig(GoalConfig goalConfig) {
        this.goalConfig = goalConfig;
        if (goalConfig != null) {
            goalConfig.setGoalPlan(this);
        }
    }

    public Long getGoalDefinitionId() {
        return goalDefinition != null ? goalDefinition.getId() : null;
    }
}