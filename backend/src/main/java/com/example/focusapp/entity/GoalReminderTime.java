package com.example.focusapp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
        name = "goal_reminder_time",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_goal_reminder_time",
                        columnNames = {"goal_plan_id", "reminder_time"}
                )
        }
)

public class GoalReminderTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "goal_plan_id", nullable = false)
    private Long goalPlanId;

    @Column(name = "reminder_time", nullable = false, length = 5)
    private String reminderTime; // "08:00"

    @Column(nullable = false)
    private Boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}