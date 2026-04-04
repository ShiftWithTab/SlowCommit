package com.example.focusapp.dto;

public class SaveUsernameResponse {

    private Integer userId;
    private String username;
    private String message;

    public SaveUsernameResponse(Integer userId, String username, String message) {
        this.userId = userId;
        this.username = username;
        this.message = message;
    }

    public Integer getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public String getMessage() {
        return message;
    }
}