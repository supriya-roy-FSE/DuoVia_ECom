package com.staysmart.stay_smart.exception;

import com.staysmart.stay_smart.dto.CheckoutResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class CheckoutExceptionHandler {

    @ExceptionHandler(CheckoutException.class)
    public ResponseEntity<CheckoutResponse> handleCheckoutException(CheckoutException ex) {
        CheckoutResponse response = new CheckoutResponse(
                false,
                null,
                ex.getUserMessage(),
                ex.getErrorCode(),
                ex.getRootCause()
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
