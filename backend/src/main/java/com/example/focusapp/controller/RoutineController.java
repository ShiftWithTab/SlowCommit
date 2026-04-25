package com.example.focusapp.controller;

import com.example.focusapp.dto.CreateRoutineRequest;
import com.example.focusapp.dto.RoutineResponse;
import com.example.focusapp.entity.Routine;
import com.example.focusapp.service.RoutineService;
import com.example.focusapp.exception.NotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/routines")
public class RoutineController {

    private final RoutineService routineService;

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody CreateRoutineRequest req) {
        routineService.createRoutine(req);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<RoutineResponse>> getRoutines(
            @RequestParam Long goalPlanId
    ) {
        return ResponseEntity.ok(
                routineService.getRoutinesByGoal(goalPlanId)
                        .stream()
                        .map(RoutineResponse::from)
                        .toList()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        routineService.deleteRoutine(id);
        return ResponseEntity.ok().build();
    }
}