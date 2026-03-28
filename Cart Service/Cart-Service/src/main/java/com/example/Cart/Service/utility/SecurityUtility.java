package com.example.Cart.Service.utility;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class SecurityUtility {
    public UUID getCurrentUserId(){
        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        return UUID.fromString(auth.getName());

    }
}
