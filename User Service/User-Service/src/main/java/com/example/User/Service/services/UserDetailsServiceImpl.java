package com.example.User.Service.services;

import com.example.User.Service.entities.UserAccount;
import com.example.User.Service.exception.CustomerResponseException;
import com.example.User.Service.repositories.UserAccountRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {


    @Autowired
    private UserAccountRepo userAccountRepo;


    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<UserAccount> account = userAccountRepo.findByUserName(username);

        if (account.isEmpty()) throw CustomerResponseException.BadCredntinals();
        UserAccount userAccount = account.get();

        return User.builder()
                .username(userAccount.getUsername())
                .password(userAccount.getPassword())
                .roles(userAccount.getRole())
                .build();
    }
}