package com.sansoll.app.service;

import com.sansoll.app.entity.Role;
import com.sansoll.app.entity.User;
import com.sansoll.app.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminUserService {

    private static final String MAIN_ADMIN_USERNAME = "ADMIN_228_1";

    private final UserRepository userRepository;

    public AdminUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Порядок: главный админ → остальные админы → пользователи.
     * Внутри каждой группы — новые сверху (id DESC).
     */
    public List<User> getAllUsers() {
        List<User> all = userRepository.findAll();
        all.sort((a, b) -> {
            boolean aIsMain = MAIN_ADMIN_USERNAME.equals(a.getUsername());
            boolean bIsMain = MAIN_ADMIN_USERNAME.equals(b.getUsername());
            if (aIsMain && !bIsMain) return -1;
            if (!aIsMain && bIsMain) return 1;

            boolean aIsAdmin = a.getRole() == Role.ADMIN;
            boolean bIsAdmin = b.getRole() == Role.ADMIN;
            if (aIsAdmin && !bIsAdmin) return -1;
            if (!aIsAdmin && bIsAdmin) return 1;

            return Long.compare(b.getId(), a.getId());
        });
        return all;
    }

    public void updateUserRole(Long id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        if (MAIN_ADMIN_USERNAME.equals(user.getUsername())) {
            throw new RuntimeException("Нельзя менять роль главного администратора");
        }

        user.setRole(Role.valueOf(role));
        userRepository.save(user);
    }
}