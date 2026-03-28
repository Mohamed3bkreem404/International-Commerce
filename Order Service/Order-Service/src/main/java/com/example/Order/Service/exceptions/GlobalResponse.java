package com.example.Order.Service.exceptions;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class GlobalResponse<T> {

    private static final String SUCCESS = "Success";
    private static final String ERROR = "Error";

    private String status;
    private T data;
    private List<ErrorItem> errors;

    public GlobalResponse(List<ErrorItem> errors) {
        this.status = ERROR;
        this.data = null;
        this.errors = errors;
    }

    public GlobalResponse(T data) {
        this.status = SUCCESS;
        this.data = data;
        this.errors = List.of();
    }

    @JsonCreator
    public GlobalResponse(
            @JsonProperty("status") String status,
            @JsonProperty("data") T data,
            @JsonProperty("errors") List<ErrorItem> errors
    ) {
        this.status = status;
        this.data = data;
        this.errors = errors;
    }

    public record ErrorItem(String message) {
    }
}
