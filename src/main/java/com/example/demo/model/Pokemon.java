package com.example.demo.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("pokemons")
public record Pokemon(
        @Id Integer id,
        String name,
        Estatisticas stats,
        List<Tipo> types) {
}
