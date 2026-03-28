package com.example.User.Service.controllers;


import com.example.User.Service.dtos.LogInRequest;
import com.example.User.Service.dtos.SignUpRequest;
import com.example.User.Service.exception.GlobalResponse;
import com.example.User.Service.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;


    @PostMapping("/signUp")
    public ResponseEntity<GlobalResponse<?>> signUp(
            @Validated
            @RequestBody SignUpRequest sign
    ) {
        authService.signUp(sign);
        return new ResponseEntity<>(new GlobalResponse<>("Signed Up"), HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<GlobalResponse<?>> logIn(
            @Validated
            @RequestBody LogInRequest logIn
    ) {
        String token = authService.logIn(logIn);
        return new ResponseEntity<>(
                new GlobalResponse<>(token), HttpStatus.CREATED);
    }



}
