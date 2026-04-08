package com.example.focusapp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class GoalConfig {

    @Id
    @Column(name = "goal_plan_id")
    private Integer goalPlanId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "goal_plan_id")
    private GoalPlan goalPlan;

    @Column(name = "alarm_cycle", nullable = false)
    private Integer alarmCycle;

    @Column(name = "preferred_emoji", length = 20)
    private String preferredEmoji;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Integer getGoalPlanId() { return goalPlanId; }
    public void setGoalPlanId(Integer goalPlanId) { this.goalPlanId = goalPlanId; }

    public GoalPlan getGoalPlan() { return goalPlan; }
    public void setGoalPlan(GoalPlan goalPlan) { this.goalPlan = goalPlan; }

    public Integer getAlarmCycle() { return alarmCycle; }
    public void setAlarmCycle(Integer alarmCycle) { this.alarmCycle = alarmCycle; }

    public String getPreferredEmoji() { return preferredEmoji; }
    public void setPreferredEmoji(String preferredEmoji) { this.preferredEmoji = preferredEmoji; }
}