package com.example.focusapp.service;

import com.example.focusapp.dto.GuestUserResponse;
import com.example.focusapp.entity.User;
import com.example.focusapp.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public GuestUserResponse createGuestUser() {
        System.out.println("🟡 UserService.createGuestUser 진입");

        User user = new User();
        user.setUsername("guest_" + System.currentTimeMillis()); // 최초엔 guest_현재시각으로 설정
        user = userRepository.save(user);

        System.out.println("🟢 guest 저장 완료: id=" + user.getId());

        return new GuestUserResponse(
                user.getId(),
                user.getUsername(),
                "게스트 사용자가 생성되었습니다."
        );
    }
}