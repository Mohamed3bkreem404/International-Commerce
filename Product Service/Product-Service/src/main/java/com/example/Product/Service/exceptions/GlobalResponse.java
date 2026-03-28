package com.example.Product.Service.exceptions;


import lombok.Getter;

import java.util.Date;
import java.util.List;

@Getter
public class GlobalResponse<T> {

    private final static String SUCCESS = "Success";
    private final static String ERROR = "Error";

    private String status;
    private T data;
    private List<ErrorItem> errors;

    public GlobalResponse(List<ErrorItem> errors){
        this.status = ERROR;
        this.data = null;
        this.errors = errors;
    }

    public GlobalResponse(T data){
        this.status = SUCCESS;
        this.data = data;
        this.errors = List.of();
    }




    public record ErrorItem(String message){

    }

}
