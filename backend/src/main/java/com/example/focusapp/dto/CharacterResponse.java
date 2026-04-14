package com.example.focusapp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CharacterResponse {
    private Integer characterId;
    private String imageUrl;
    private Integer level;
}