package com.example.Cart.Service.exceptions;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class CustomerResponseException extends RuntimeException{

    private int code;
    private String message;

    public static CustomerResponseException ResourceNotFound(String message) {
        return new CustomerResponseException(404, message);
    }


    public static CustomerResponseException BadCredntinals() {
        return new CustomerResponseException(401, "BadCredintals");
    }

    //public static CustomerResponseException
}