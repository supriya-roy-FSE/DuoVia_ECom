package com.staysmart.stay_smart.dto;

public class CheckoutResponse {
    private boolean success;
    private String orderId;
    private String message;
    private String errorCode;
    private String rootCause;

    public CheckoutResponse() {
    }

    public CheckoutResponse(boolean success, String orderId, String message, String errorCode, String rootCause) {
        this.success = success;
        this.orderId = orderId;
        this.message = message;
        this.errorCode = errorCode;
        this.rootCause = rootCause;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getRootCause() {
        return rootCause;
    }

    public void setRootCause(String rootCause) {
        this.rootCause = rootCause;
    }
}
