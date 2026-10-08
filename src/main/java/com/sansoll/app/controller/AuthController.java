package com.sansoll.app.controller;

import com.sansoll.app.config.JwtUtil;
import com.sansoll.app.dto.LoginDto;
import com.sansoll.app.dto.RegisterDto;
import com.sansoll.app.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDto registerDto) {
        try {
            String token = authService.register(registerDto);
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "username", registerDto.getUsername()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        try {
            String token = authService.login(loginDto);
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "username", loginDto.getUsername()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.ok(Map.of("message", "No token to revoke"));
            }
            String jwt = authHeader.substring(7);
            String username = jwtUtil.extractUsername(jwt);
            authService.logout(username);
            return ResponseEntity.ok(Map.of("message", "Logged out"));
        } catch (Exception e) {
            // Токен битый/протух — клиент всё равно чистит localStorage
            return ResponseEntity.ok(Map.of("message", "Logged out (token invalid)"));
        }
    }
}