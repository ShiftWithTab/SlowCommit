package com.example.focusapp.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "goal_configs")
public class GoalConfig {

    @Id
    @Column(name = "goal_plan_id")
    private Long goalPlanId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "goal_plan_id")
    private GoalPlan goalPlan;

    @Column(name = "alarm_cycle", nullable = false)
    private Integer alarmCycle = 1;

    @Column(name = "preferred_emoji", length = 20)
    private String preferredEmoji;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}