package com.example.focusapp.dto;

public class SaveUsernameResponse {

    private Long userId;
    private String username;
    private String message;

    public SaveUsernameResponse(Long userId, String username, String message) {
        this.userId = userId;
        this.username = username;
        this.message = message;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public String getMessage() {
        return message;
    }
}