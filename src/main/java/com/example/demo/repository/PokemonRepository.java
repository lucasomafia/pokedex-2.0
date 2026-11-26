package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.demo.model.Pokemon;

public interface PokemonRepository extends MongoRepository<Pokemon, Integer> {

    Optional<Pokemon> findTopByOrderByIdDesc();

    List<Pokemon> findByNameContainingIgnoreCase(String nome, Sort ordem);

    List<Pokemon> findByTypesNameIgnoreCase(String tipo, Sort ordem);

    List<Pokemon> findByNameContainingIgnoreCaseAndTypesNameIgnoreCase(String nome, String tipo, Sort ordem);
}
