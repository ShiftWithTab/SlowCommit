package com.example.focusapp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CharacterResponse {
    private Long characterId;
    private String imageUrl;
    private Integer level;
}