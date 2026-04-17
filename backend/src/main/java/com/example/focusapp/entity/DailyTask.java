package com.example.focusapp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_tasks")
@Getter
@Setter
@NoArgsConstructor
public class DailyTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "goal_plan_id", nullable = false)
    private GoalPlan goalPlan;

    @Column(nullable = false)
    private LocalDate targetDate;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private boolean completed = false;

    private LocalDateTime completedAt;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public DailyTask(GoalPlan goalPlan, LocalDate targetDate) {
        this.goalPlan = goalPlan;
        this.targetDate = targetDate;
    }
}