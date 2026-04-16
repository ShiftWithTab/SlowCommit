package com.example.focusapp.repository;

import com.example.focusapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);
    boolean existsByUsernameAndIdNot(String username, Long id); //본인이름 재저장 시 중복확인 체크
}