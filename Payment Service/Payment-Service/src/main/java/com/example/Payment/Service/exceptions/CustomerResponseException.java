package com.example.Payment.Service.exceptions;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class CustomerResponseException extends RuntimeException {

    private int code;
    private String message;

    public static CustomerResponseException ResourceNotFound(String message) {
        return new CustomerResponseException(404, message);
    }

    public static CustomerResponseException BadRequest(String message) {
        return new CustomerResponseException(400, message);
    }
}
