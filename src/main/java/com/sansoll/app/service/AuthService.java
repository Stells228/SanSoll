package com.sansoll.app.service;

import com.sansoll.app.config.JwtUtil;
import com.sansoll.app.dto.LoginDto;
import com.sansoll.app.dto.RegisterDto;
import com.sansoll.app.entity.Role;
import com.sansoll.app.entity.User;
import com.sansoll.app.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AnalyticsService analyticsService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       AnalyticsService analyticsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.analyticsService = analyticsService;
    }

    @Transactional
    public String register(RegisterDto registerDto) {
        if (userRepository.existsByUsername(registerDto.getUsername())) {
            throw new RuntimeException("Пользователь с таким именем уже существует");
        }
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new RuntimeException("Email уже используется");
        }

        User user = new User();
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setRole(Role.USER);
        user.setTokenVersion(0);

        userRepository.save(user);
        analyticsService.logLogin(user.getUsername());

        return jwtUtil.generateToken(user.getUsername(), 0);
    }

    public String login(LoginDto loginDto) {
        User user = userRepository.findByUsername(loginDto.getUsername())
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Неверный пароль");
        }

        analyticsService.logLogin(user.getUsername());

        return jwtUtil.generateToken(user.getUsername(), user.getTokenVersion());
    }

    @Transactional
    public void logout(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        user.setTokenVersion(user.getTokenVersion() + 1);
        userRepository.save(user);

        log.info("Logout: {} → tokenVersion = {}", username, user.getTokenVersion());
    }
}