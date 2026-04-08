package com.example.focusapp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "goal_configs")
public class GoalConfig {

    @Id
    @Column(name = "goal_plan_id")
    private Integer goalPlanId;

    @Column(name = "alarm_cycle", nullable = false)
    private Integer alarmCycle;

    @Column(name = "preferred_emoji", length = 20)
    private String preferredEmoji;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public Integer getGoalPlanId() { return goalPlanId; }
    public void setGoalPlanId(Integer goalPlanId) { this.goalPlanId = goalPlanId; }
    public Integer getAlarmCycle() { return alarmCycle; }
    public void setAlarmCycle(Integer alarmCycle) { this.alarmCycle = alarmCycle; }
    public String getPreferredEmoji() { return preferredEmoji; }
    public void setPreferredEmoji(String preferredEmoji) { this.preferredEmoji = preferredEmoji; }
}
