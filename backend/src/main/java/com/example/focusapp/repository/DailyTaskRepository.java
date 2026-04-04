package com.example.focusapp.repository;

import com.example.focusapp.entity.DailyTask;
import com.example.focusapp.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface DailyTaskRepository extends JpaRepository<DailyTask, Long> {

    boolean existsByTaskAndTargetDate(Task task, LocalDate targetDate);

    Optional<DailyTask> findFirstByTaskAndTargetDateLessThanEqualOrderByTargetDateDesc(
            Task task,
            LocalDate today
    );
}