package com.example.focusapp.dto;

public class NicknameCheckResponse {

    private boolean available;
    private String message;

    public NicknameCheckResponse(boolean available, String message) {
        this.available = available;
        this.message = message;
    }

    public boolean isAvailable() { return available; }
    public String getMessage() { return message; }
}