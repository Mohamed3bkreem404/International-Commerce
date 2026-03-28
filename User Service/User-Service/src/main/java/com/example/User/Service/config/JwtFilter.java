package com.example.User.Service.config;


import com.example.User.Service.entities.UserAccount;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


@Component
public class JwtFilter extends OncePerRequestFilter {


    @Autowired
    private JwtHelper jwtHelper;

    @Autowired
    private UserDetailsService userDetailsService;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //testing if filter works
        //System.out.println("el filter molo111111111111111111111111ky");

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")){
            token = authHeader.substring(7);

        }

        if (token == null){
            filterChain.doFilter(request , response);
            return;
        }

        username = jwtHelper.extractUsername(token);

        if (username != null){
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            Boolean isTokenValid = jwtHelper.isTokenValid(token , userDetails);

            if (isTokenValid){
                var authenticationToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }

        filterChain.doFilter(request , response);
    }
}
