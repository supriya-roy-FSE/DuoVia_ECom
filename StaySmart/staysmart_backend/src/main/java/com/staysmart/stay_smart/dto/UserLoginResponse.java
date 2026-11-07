package com.staysmart.stay_smart.dto;

import com.staysmart.stay_smart.entity.UserEntity;

public class UserLoginResponse {
    private boolean success;
    private String message;
    private UserEntity user;

    public UserLoginResponse(boolean success, String message, UserEntity user) {
        this.success = success;
        this.message = message;
        this.user = user;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public UserEntity getUser() { return user; }
    public void setUser(UserEntity user) { this.user = user; }
}
