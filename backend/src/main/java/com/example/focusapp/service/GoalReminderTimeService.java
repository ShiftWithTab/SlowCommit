package com.example.focusapp.service;

import com.example.focusapp.dto.ReminderCreateRequest;
import com.example.focusapp.dto.ReminderResponse;
import com.example.focusapp.dto.ReminderUpdateRequest;
import com.example.focusapp.entity.GoalReminderTime;
import com.example.focusapp.repository.GoalReminderTimeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.regex.Pattern;

@Service
public class GoalReminderTimeService {

    private final GoalReminderTimeRepository repository;

    private static final Pattern TIME_PATTERN =
            Pattern.compile("^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$");

    public GoalReminderTimeService(GoalReminderTimeRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public ReminderResponse create(ReminderCreateRequest request) {
        validateTime(request.getReminderTime());

        if (repository.existsByGoalPlanIdAndReminderTime(
                request.getGoalPlanId(),
                request.getReminderTime()
        )) {
            throw new IllegalArgumentException("이미 등록된 리마인더 시간입니다.");
        }

        GoalReminderTime reminder = new GoalReminderTime();
        reminder.setGoalPlanId(request.getGoalPlanId());
        reminder.setReminderTime(request.getReminderTime());
        reminder.setActive(true);

        GoalReminderTime saved = repository.save(reminder);

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ReminderResponse> getByGoalPlanId(Long goalPlanId) {
        return repository.findByGoalPlanIdOrderByReminderTimeAsc(goalPlanId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ReminderResponse update(Long id, ReminderUpdateRequest request) {
        GoalReminderTime reminder = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("리마인더를 찾을 수 없습니다."));

        if (request.getReminderTime() != null) {
            validateTime(request.getReminderTime());

            repository.findByGoalPlanIdAndReminderTime(
                    reminder.getGoalPlanId(),
                    request.getReminderTime()
            ).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new IllegalArgumentException("이미 등록된 리마인더 시간입니다.");
                }
            });

            reminder.setReminderTime(request.getReminderTime());
        }

        if (request.getActive() != null) {
            reminder.setActive(request.getActive());
        }

        return toResponse(reminder);
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }

    private void validateTime(String reminderTime) {
        if (reminderTime == null || !TIME_PATTERN.matcher(reminderTime).matches()) {
            throw new IllegalArgumentException("리마인더 시간은 HH:mm 형식이어야 합니다. 예: 08:00");
        }
    }

    private ReminderResponse toResponse(GoalReminderTime reminder) {
        return new ReminderResponse(
                reminder.getId(),
                reminder.getGoalPlanId(),
                reminder.getReminderTime(),
                reminder.getActive()
        );
    }
}