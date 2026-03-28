package com.example.Cart.Service.config;


import com.example.Cart.Service.config.JwtHelper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;


@Component
public class JwtFilter extends OncePerRequestFilter {


    @Autowired
    private JwtHelper jwtHelper;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {


        String authHeader = request.getHeader("Authorization");
        String token = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")){
            token = authHeader.substring(7);

        }

        if (token == null){
            filterChain.doFilter(request , response);
            return;
        }

        String username = jwtHelper.extractUsername(token);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null){

            String role = jwtHelper.extractClaim(token , claims -> claims.get("role" , String.class));
            String userId = jwtHelper.extractClaim(token , claims -> claims.get("userId" , String.class));


            var authorities = List.of(
                    new SimpleGrantedAuthority("ROLE_" + role)
            );

            var authenticationToken = new UsernamePasswordAuthenticationToken(
                    userId,
                    null,
                    authorities
            );

            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }

        System.out.println(SecurityContextHolder.getContext().getAuthentication());
        filterChain.doFilter(request , response);
    }
}
