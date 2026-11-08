package com.staysmart.stay_smart.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/api/admin/login", "/api/orders", "/api/feedback", "/api/users/register", "/api/users/login").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/admin/health", "/api/orders", "/api/feedback", "/api/users/me/**").permitAll()
                .anyRequest().authenticated()
            );

        return http.build();
    }
}
