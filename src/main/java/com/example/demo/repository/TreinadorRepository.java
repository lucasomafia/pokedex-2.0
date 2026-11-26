package com.example.demo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.demo.model.Treinador;

public interface TreinadorRepository extends MongoRepository<Treinador, Integer> {
}
