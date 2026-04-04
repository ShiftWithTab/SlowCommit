package com.example.focusapp.controller;

import com.example.focusapp.dto.GuestUserResponse;
import com.example.focusapp.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/guest")
    public ResponseEntity<?> createGuestUser() {
        System.out.println("🔥 /api/users/guest 호출됨");
        return ResponseEntity.ok(userService.createGuestUser());
    }
}