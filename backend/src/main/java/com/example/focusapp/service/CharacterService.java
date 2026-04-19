package com.example.focusapp.service;

import com.example.focusapp.dto.CharacterResponse;
import com.example.focusapp.dto.CharacterListResponse;
import com.example.focusapp.repository.CharacterRepository;
import com.example.focusapp.entity.CharacterImage;
import com.example.focusapp.entity.GoalPlan;
import com.example.focusapp.entity.User;
import com.example.focusapp.exception.NotFoundException;
import com.example.focusapp.repository.CharacterImageRepository;
import com.example.focusapp.repository.GoalPlanRepository;
import com.example.focusapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CharacterService {

    private final UserRepository userRepository;
    private final GoalPlanRepository goalPlanRepository;
    private final CharacterImageRepository characterImageRepository;
    private final CharacterRepository characterRepository;

    @Transactional(readOnly = true)
    public CharacterResponse getCurrentCharacter(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User 없음"));

        GoalPlan goalPlan = goalPlanRepository.findActiveByUserId(userId)
                .orElseThrow(() -> new NotFoundException("GoalPlan 없음"));

        System.out.println("goalPlanId = " + goalPlan.getId());
        System.out.println("level = " + goalPlan.getCurrentLevel());
        System.out.println("characterId = " + goalPlan.getCharacter().getId());


        int level = goalPlan.getCurrentLevel();
        Long characterId = goalPlan.getCharacter().getId();

        int imageLevel = convertLevelToImageLevel(level);

        System.out.println("imageLevel = " + imageLevel);

        CharacterImage image = characterImageRepository
                .findByCharacterIdAndLevel(characterId, imageLevel)
                .orElseThrow(() -> new NotFoundException("캐릭터 이미지 없음"));

        return new CharacterResponse(
                characterId,
                image.getImageUrl(),
                level
        );
    }

    private int convertLevelToImageLevel(int level) {

        if (level <= 3) return 1;
        if (level <= 6) return 2;
        if (level <= 8) return 3;
        return 4;
    }

    @Transactional(readOnly = true)
    public List<CharacterListResponse> getAllCharacters() {
        return characterRepository.findAll()
                .stream()
                .map(c -> new CharacterListResponse(
                        c.getId(),
                        c.getName(),
                        c.getBaseImageUrl()
                ))
                .toList();
    }
}