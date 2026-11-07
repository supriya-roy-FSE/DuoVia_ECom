package com.staysmart.stay_smart.exception;

public class CheckoutException extends RuntimeException {
    private final String errorCode;
    private final String userMessage;
    private final String rootCause;

    public CheckoutException(String errorCode, String userMessage, String rootCause) {
        super(userMessage);
        this.errorCode = errorCode;
        this.userMessage = userMessage;
        this.rootCause = rootCause;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public String getUserMessage() {
        return userMessage;
    }

    public String getRootCause() {
        return rootCause;
    }
}
