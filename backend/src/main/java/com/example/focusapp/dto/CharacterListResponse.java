
package com.example.focusapp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CharacterListResponse {
    private Long id;
    private String name;
    private String imageUrl;
}