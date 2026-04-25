package com.example.focusapp.controller;

import com.example.focusapp.dto.CharacterResponse;
import com.example.focusapp.dto.CharacterListResponse;
import com.example.focusapp.service.CharacterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/characters")
@RequiredArgsConstructor
@CrossOrigin
public class CharacterController {

    private final CharacterService characterService;

    @GetMapping("/current")
    public ResponseEntity<CharacterResponse> getCurrentCharacter(
            @RequestParam Long goalPlanId
    ) {
        return ResponseEntity.ok(
                characterService.getCurrentCharacterByGoalPlan(goalPlanId)
        );
    }
    
    @GetMapping
    public ResponseEntity<List<CharacterListResponse>> getCharacters() {
        return ResponseEntity.ok(characterService.getAllCharacters());
    }
}