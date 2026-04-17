package com.example.focusapp.service;

import com.example.focusapp.entity.User;
import com.example.focusapp.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.focusapp.dto.UserResponse;

@Service
public class UserService {

    private final UserRepository userRepository;
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    private User getUserEntity(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."));
    }

    @Transactional(readOnly = true)
    public UserResponse getUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getTheme()
        );
    }

    @Transactional
    public UserResponse updateUsername(Long userId, String username) {
        User user = getUserEntity(userId);

        String trimmed = username == null ? "" : username.trim();

        if (trimmed.isEmpty()) {
            throw new IllegalArgumentException("별명을 입력해주세요.");
        }

        boolean duplicated = userRepository.existsByUsernameAndIdNot(trimmed, userId);
        if (duplicated) {
            throw new IllegalArgumentException("이미 사용 중인 별명입니다.");
        }

        user.setUsername(trimmed);

        userRepository.save(user);

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getTheme()
        );
    }

    @Transactional
    public UserResponse updateTheme(Long userId, String theme) {
        User user = getUserEntity(userId);

        if (theme == null || (!theme.equals("light") && !theme.equals("dark"))) {
            throw new IllegalArgumentException("theme 값이 올바르지 않습니다.");
        }

        user.setTheme(theme);

        userRepository.save(user);

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getTheme()
        );
    }

    @Transactional(readOnly = true)
    public boolean existsUsername(String username) {
        return userRepository.existsByUsername(username);
    }
}