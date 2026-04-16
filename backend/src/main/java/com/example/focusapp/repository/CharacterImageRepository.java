package com.example.focusapp.repository;

import com.example.focusapp.entity.CharacterImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CharacterImageRepository
        extends JpaRepository<CharacterImage, Long> {

    Optional<CharacterImage> findByCharacterIdAndLevel(Long characterId, Integer level);
}