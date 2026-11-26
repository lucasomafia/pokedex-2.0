package com.example.demo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.demo.model.Pokemon;

public interface PokemonRepository extends MongoRepository<Pokemon, Integer> {
}
