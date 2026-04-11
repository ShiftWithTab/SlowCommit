package com.example.focusapp.controller;

import com.example.focusapp.dto.CharacterResponse;
import com.example.focusapp.service.CharacterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/characters")
@RequiredArgsConstructor
@CrossOrigin
public class CharacterController {

    private final CharacterService characterService;

    @GetMapping("/current")
    public ResponseEntity<CharacterResponse> getCurrentCharacter(
            @RequestParam Integer userId
    ) {
        return ResponseEntity.ok(
                characterService.getCurrentCharacter(userId)
        );
    }
}