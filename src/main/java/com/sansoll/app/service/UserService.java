package com.sansoll.app.service;

import com.sansoll.app.dto.UpdatePasswordDto;
import com.sansoll.app.dto.UpdateProfileDto;
import com.sansoll.app.dto.UserDto;
import com.sansoll.app.entity.Role;
import com.sansoll.app.entity.User;
import com.sansoll.app.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class UserService {

    private static final String ADMIN_USERNAME = "ADMIN_228_1";
    private static final String AVATAR_DIR = System.getProperty("user.dir") + "/uploads/avatars/";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void updateProfile(String currentUsername, UpdateProfileDto dto) {
        if (ADMIN_USERNAME.equals(currentUsername)) {
            throw new RuntimeException("Логин администратора нельзя менять");
        }
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        if (!user.getUsername().equals(dto.getNewUsername())
                && userRepository.existsByUsername(dto.getNewUsername())) {
            throw new RuntimeException("Это имя пользователя уже занято");
        }

        user.setUsername(dto.getNewUsername());
        user.setPhone(dto.getPhone());
        userRepository.save(user);
    }

    public void updatePassword(String currentUsername, UpdatePasswordDto dto) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Неверный текущий пароль");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
    }

    public UserDto getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        UserDto dto = new UserDto();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setAvatarUrl(user.getAvatarUrl());
        return dto;
    }

    public void deleteAccount(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Неверный пароль");
        }

        userRepository.delete(user);
    }

    public void updateUserRole(Long userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        if (ADMIN_USERNAME.equals(user.getUsername())) {
            throw new RuntimeException("Нельзя менять роль главного администратора");
        }

        user.setRole(Role.valueOf(role));
        userRepository.save(user);
    }

    public String uploadAvatar(String username, MultipartFile file) {
        try {
            File dir = new File(AVATAR_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || !originalFilename.contains(".")) {
                throw new RuntimeException("Некорректное имя файла");
            }

            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = username + "_" + System.currentTimeMillis() + extension;

            Path filePath = Paths.get(AVATAR_DIR + newFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String avatarUrl = "/uploads/avatars/" + newFilename;
            updateAvatarUrl(username, avatarUrl);

            return avatarUrl;
        } catch (Exception e) {
            throw new RuntimeException("Ошибка загрузки файла: " + e.getMessage());
        }
    }

    private void updateAvatarUrl(String username, String avatarUrl) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        user.setAvatarUrl(avatarUrl);
        userRepository.save(user);
    }
}