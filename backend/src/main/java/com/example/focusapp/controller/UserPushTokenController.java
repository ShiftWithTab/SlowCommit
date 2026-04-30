package com.example.focusapp.controller;

import com.example.focusapp.dto.PushTokenRequest;
import com.example.focusapp.dto.PushTokenResponse;
import com.example.focusapp.service.UserPushTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/push-tokens")
@RequiredArgsConstructor
@CrossOrigin
public class UserPushTokenController {

    private final UserPushTokenService userPushTokenService;

    @PostMapping
    public ResponseEntity<PushTokenResponse> saveToken(
            @RequestBody PushTokenRequest request
    ) {
        return ResponseEntity.ok(userPushTokenService.saveToken(request));
    }

    @PatchMapping("/{id}/inactive")
    public ResponseEntity<Void> deactivateToken(@PathVariable Long id) {
        userPushTokenService.deactivateToken(id);
        return ResponseEntity.noContent().build();
    }
}