package com.example.focusapp.controller;

import com.example.focusapp.dto.ReminderCreateRequest;
import com.example.focusapp.dto.ReminderResponse;
import com.example.focusapp.dto.ReminderUpdateRequest;
import com.example.focusapp.service.GoalReminderTimeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
public class GoalReminderTimeController {

    private final GoalReminderTimeService service;

    public GoalReminderTimeController(GoalReminderTimeService service) {
        this.service = service;
    }

    @PostMapping
    public ReminderResponse create(@RequestBody ReminderCreateRequest request) {
        return service.create(request);
    }

    @GetMapping("/goal-plans/{goalPlanId}")
    public List<ReminderResponse> getByGoalPlanId(@PathVariable Long goalPlanId) {
        return service.getByGoalPlanId(goalPlanId);
    }

    @PatchMapping("/{id}")
    public ReminderResponse update(
            @PathVariable Long id,
            @RequestBody ReminderUpdateRequest request
    ) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}