package com.example.User.Service.services;


import com.example.User.Service.config.JwtHelper;
import com.example.User.Service.dtos.LogInRequest;
import com.example.User.Service.dtos.SignUpRequest;
import com.example.User.Service.entities.UserAccount;
import com.example.User.Service.exception.CustomerResponseException;
import com.example.User.Service.repositories.UserAccountRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {
    @Autowired
    private UserAccountRepo userAccountRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtHelper jwtHelper;

    public void signUp(SignUpRequest sign) {

        UserAccount userAccount = new UserAccount();

        userAccount.setUserName(sign.userName());
        userAccount.setPassword(passwordEncoder.encode(sign.password()));

        userAccountRepo.save(userAccount);
    }

    public String logIn(LogInRequest logIn) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        logIn.username(),
                        logIn.password()

                )
        );
        //jwtHelper.generateToken();
        UserAccount userAccount = userAccountRepo.findByUserName(logIn.username())
                .orElseThrow(CustomerResponseException::BadCredntinals);

        Map<String , Object> customClaims = new HashMap<>();

        customClaims.put("userId" , userAccount.getId());
        customClaims.put("username" , userAccount.getUsername());
        customClaims.put("role" , userAccount.getRole());


        return jwtHelper.generateToken(customClaims , userAccount);

    }

}
