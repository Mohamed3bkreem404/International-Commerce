package com.example.Payment.Service.exceptions;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.List;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<GlobalResponse<?>> handlenoResourceException(NoResourceFoundException no) {
        var errors = List.of(
                new GlobalResponse.ErrorItem("Resources not found")
        );
        return new ResponseEntity<>(new GlobalResponse<>(errors), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<GlobalResponse<?>> handleValidation(Exception ex) {
        var errors = List.of(
                new GlobalResponse.ErrorItem(ex.getMessage())
        );
        return new ResponseEntity<>(new GlobalResponse<>(errors), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<GlobalResponse<?>> handleValidMethod(MethodArgumentNotValidException ma) {
        var errors = ma.getBindingResult().getFieldErrors().stream()
                .map(err -> new GlobalResponse.ErrorItem(err.getField() + err.getDefaultMessage()))
                .toList();
        return new ResponseEntity<>(new GlobalResponse<>(errors), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleEmptyMessage(HttpMessageNotReadableException hm) {
        var error = List.of(
                new GlobalResponse.ErrorItem("Wrong or empty body ya mamlka")
        );
        return new ResponseEntity<GlobalResponse<?>>(new GlobalResponse<>(error), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<?> handlRequestNotSupported(HttpRequestMethodNotSupportedException ex) {
        var error = List.of(
                new GlobalResponse.ErrorItem("Wrong CRUD selected")
        );
        return new ResponseEntity<GlobalResponse<?>>(new GlobalResponse<>(error), HttpStatus.METHOD_NOT_ALLOWED);
    }

    @ExceptionHandler(CustomerResponseException.class)
    public ResponseEntity<GlobalResponse<?>> handlenoException(CustomerResponseException cr) {
        var errors = List.of(
                new GlobalResponse.ErrorItem(cr.getMessage())
        );
        HttpStatus status = HttpStatus.valueOf(cr.getCode());
        return new ResponseEntity<>(new GlobalResponse<>(errors), status);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<GlobalResponse<?>> handleArgumentMis(MethodArgumentTypeMismatchException ma) {
        var errors = List.of(
                new GlobalResponse.ErrorItem(ma.getMessage())
        );
        return new ResponseEntity<>(new GlobalResponse<>(errors), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<GlobalResponse<?>> handleDataViolation(DataIntegrityViolationException dv) {
        var errors = List.of(
                new GlobalResponse.ErrorItem("Repeated Data , uncompleted body")
        );
        return new ResponseEntity<>(new GlobalResponse<>(errors), HttpStatus.BAD_REQUEST);
    }
}
