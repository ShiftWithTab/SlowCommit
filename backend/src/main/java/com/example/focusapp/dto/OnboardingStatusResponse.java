package com.example.focusapp.dto;

public class OnboardingStatusResponse {
    private Integer userId;
    private boolean hasUsername;
    private String username;
    private boolean hasGoal;

    public OnboardingStatusResponse(Integer userId, boolean hasUsername, String username, boolean hasGoal) {
        this.userId = userId;
        this.hasUsername = hasUsername;
        this.username = username;
        this.hasGoal = hasGoal;
    }

    public Integer getUserId() { return userId; }
    public boolean isHasUsername() { return hasUsername; }
    public String getUsername() { return username; }
    public boolean isHasGoal() { return hasGoal; }
}