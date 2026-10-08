package com.sansoll.app.controller;

import com.sansoll.app.dto.UpdatePasswordDto;
import com.sansoll.app.dto.UpdateProfileDto;
import com.sansoll.app.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestParam String username,
                                           @RequestBody UpdateProfileDto dto) {
        try {
            userService.updateProfile(username, dto);
            return ResponseEntity.ok(Map.of("message", "Профиль успешно обновлен"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@RequestParam String username,
                                            @RequestBody UpdatePasswordDto dto) {
        try {
            userService.updatePassword(username, dto);
            return ResponseEntity.ok(Map.of("message", "Пароль успешно изменен"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestParam String username) {
        try {
            return ResponseEntity.ok(userService.getUserProfile(username));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/account")
    public ResponseEntity<?> deleteAccount(@RequestParam String username,
                                           @RequestBody Map<String, String> payload) {
        try {
            userService.deleteAccount(username, payload.get("password"));
            return ResponseEntity.ok(Map.of("message", "Аккаунт успешно удален"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam String username,
                                          @RequestParam("file") MultipartFile file) {
        try {
            String avatarUrl = userService.uploadAvatar(username, file);
            return ResponseEntity.ok(Map.of("avatarUrl", avatarUrl));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}