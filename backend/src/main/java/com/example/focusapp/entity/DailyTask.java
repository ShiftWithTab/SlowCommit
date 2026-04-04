package com.example.focusapp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "daily_tasks",
        uniqueConstraints = @UniqueConstraint(columnNames = {"task_id", "target_date"})
)
@Getter
@Setter
@NoArgsConstructor
public class DailyTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "task_id")
    private Task task;

    @Column(nullable = false)
    private LocalDate targetDate;

    @Column(nullable = false)
    private boolean completed = false;

    private LocalDateTime completedAt;

    public DailyTask(Task task, LocalDate targetDate) {
        this.task = task;
        this.targetDate = targetDate;
    }
}