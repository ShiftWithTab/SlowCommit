package com.example.focusapp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Getter
@NoArgsConstructor
@Table(
        name = "goal_result",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "goal_plan_id") // ⭐ 1개만 생성 보장
        }
)
public class GoalResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ⭐ GoalPlan 1:1
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "goal_plan_id", nullable = false)
    private GoalPlan goalPlan;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResultType resultType;

    @Column(nullable = false, length = 255)
    private String message;

    @Column(nullable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private boolean isSeen = false;

    public GoalResult(GoalPlan goalPlan, ResultType resultType, String message) {
        this.goalPlan = goalPlan;
        this.resultType = resultType;
        this.message = message;
        this.createdAt = LocalDateTime.now();
        this.isSeen = false;
    }

    public void markAsSeen() {
        this.isSeen = true;
    }
}