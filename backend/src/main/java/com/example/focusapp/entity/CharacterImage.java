package com.example.focusapp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "character_images")
@Getter
@Setter
public class CharacterImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long characterId;
    private Integer level;
    private String imageUrl;
}