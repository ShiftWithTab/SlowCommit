package com.example.focusapp.controller;

import com.example.focusapp.service.UserService;
import com.example.focusapp.service.OnboardingService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserService userService;
    private final OnboardingService onboardingService;

    public UserController(UserService userService, OnboardingService onboardingService) {
        this.userService = userService;
        this.onboardingService = onboardingService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUser(userId));
    }

    @PatchMapping("/{userId}/username")
    public ResponseEntity<?> updateUsername(
            @PathVariable Long userId,
            @RequestParam String username
    ) {
        return ResponseEntity.ok(userService.updateUsername(userId, username));
    }

    @PatchMapping("/{userId}/theme")
    public ResponseEntity<?> updateTheme(
            @PathVariable Long userId,
            @RequestParam String theme
    ) {
        return ResponseEntity.ok(userService.updateTheme(userId, theme));
    }
    @PostMapping("/guest")
    public ResponseEntity<?> createGuestUser() {
        return ResponseEntity.ok(userService.createGuestUser());
    }
}