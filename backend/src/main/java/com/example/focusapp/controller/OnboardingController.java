package com.example.focusapp.controller;

import com.example.focusapp.dto.*;
import com.example.focusapp.service.OnboardingService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/onboarding")
@CrossOrigin
public class OnboardingController {

    private final OnboardingService onboardingService;

    public OnboardingController(OnboardingService onboardingService){
        this.onboardingService = onboardingService;
    }
    @GetMapping("/check-nickname")
    public NicknameCheckResponse checkNickname(@RequestParam String nickname) {
        return onboardingService.checkNickname(nickname);
    }

    @GetMapping("/status")
    public ResponseEntity<OnboardingStatusResponse> getStatus(@RequestParam Integer userId) {
        return ResponseEntity.ok(onboardingService.getStatus(userId));
    }

    @PostMapping("/username")
    public ResponseEntity<SaveUsernameResponse> saveUsername(@RequestBody SaveUsernameRequest request) {
        return ResponseEntity.ok(onboardingService.saveUsername(request));
    }

    @PostMapping("/setup")
    public ResponseEntity<SetupResponse> setup(@RequestBody SetupRequest request) {
        return ResponseEntity.ok(onboardingService.setup(request));
    }
}