package com.project.safe.dto;

public class ResetPasswordRequest {
    private String userId;
    private String newPassword;

    public ResetPasswordRequest() {}

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}

