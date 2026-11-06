package com.staysmart.stay_smart.dto;

public class AdminLoginResponse {
    private boolean success;
    private String message;
    private String redirectTo;

    public AdminLoginResponse(boolean success, String message, String redirectTo) {
        this.success = success;
        this.message = message;
        this.redirectTo = redirectTo;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRedirectTo() {
        return redirectTo;
    }

    public void setRedirectTo(String redirectTo) {
        this.redirectTo = redirectTo;
    }
}
