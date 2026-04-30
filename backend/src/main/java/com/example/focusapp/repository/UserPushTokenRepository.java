package com.example.focusapp.repository;

import com.example.focusapp.entity.UserPushToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserPushTokenRepository extends JpaRepository<UserPushToken, Long> {

    boolean existsByUserIdAndPushToken(Long userId, String pushToken);

    Optional<UserPushToken> findByUserIdAndPushToken(Long userId, String pushToken);

    List<UserPushToken> findByUserIdAndActiveTrue(Long userId);
}