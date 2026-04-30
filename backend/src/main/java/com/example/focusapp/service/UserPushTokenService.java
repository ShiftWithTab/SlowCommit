package com.example.focusapp.service;

import com.example.focusapp.dto.PushTokenRequest;
import com.example.focusapp.dto.PushTokenResponse;
import com.example.focusapp.entity.UserPushToken;
import com.example.focusapp.repository.UserPushTokenRepository;
import com.example.focusapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserPushTokenService {

    private final UserPushTokenRepository pushTokenRepository;
    private final UserRepository userRepository;

    @Transactional
    public PushTokenResponse saveToken(PushTokenRequest request) {
        if (request.getUserId() == null) {
            throw new IllegalArgumentException("userId가 필요합니다.");
        }

        if (request.getPushToken() == null || request.getPushToken().trim().isEmpty()) {
            throw new IllegalArgumentException("pushToken이 필요합니다.");
        }

        userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        return pushTokenRepository
                .findByUserIdAndPushToken(request.getUserId(), request.getPushToken())
                .map(existing -> {
                    if (!existing.getActive()) {
                        existing.setActive(true);
                    }
                    return toResponse(existing);
                })
                .orElseGet(() -> {
                    UserPushToken token = new UserPushToken();
                    token.setUserId(request.getUserId());
                    token.setPushToken(request.getPushToken());
                    token.setActive(true);

                    return toResponse(pushTokenRepository.save(token));
                });
    }

    @Transactional
    public void deactivateToken(Long id) {
        UserPushToken token = pushTokenRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("푸시 토큰을 찾을 수 없습니다."));

        token.setActive(false);
    }

    private PushTokenResponse toResponse(UserPushToken token) {
        return new PushTokenResponse(
                token.getId(),
                token.getUserId(),
                token.getPushToken(),
                token.getActive()
        );
    }
}