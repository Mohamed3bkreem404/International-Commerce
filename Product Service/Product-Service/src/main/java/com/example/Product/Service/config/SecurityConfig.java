package com.example.Product.Service.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
@Configuration
public class SecurityConfig {


    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

        httpSecurity
                .cors(AbstractHttpConfigurer::disable)
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> {
                    auth
                            .requestMatchers(HttpMethod.POST, "/api/v1/products/**").hasRole("ADMIN")
                            .requestMatchers(HttpMethod.DELETE, "/api/v1/products/**").hasRole("ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/v1/products/**").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.PUT, "/api/v1/products/**").hasRole("ADMIN")

                            .anyRequest().authenticated();

                })

                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

//                .httpBasic(Customizer.withDefaults());
        return httpSecurity.build();
    }


}
