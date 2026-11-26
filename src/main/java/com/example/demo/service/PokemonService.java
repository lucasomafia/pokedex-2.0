package com.example.demo.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.model.Pokemon;
import com.example.demo.repository.PokemonRepository;

@Service
public class PokemonService {

    private final PokemonRepository pokemonRepository;

    public PokemonService(PokemonRepository pokemonRepository) {
        this.pokemonRepository = pokemonRepository;
    }

    public List<Pokemon> listarTodos() {
        return pokemonRepository.findAll(Sort.by("id"));
    }

    public Pokemon buscarPorId(Integer id) {
        return pokemonRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pokémon " + id + " não encontrado"));
    }

    public Pokemon cadastrar(Pokemon pokemon) {
        validar(pokemon);
        Integer id = pokemon.id();
        if (id == null) {
            id = pokemonRepository.findTopByOrderByIdDesc().map(ultimo -> ultimo.id() + 1).orElse(1);
        } else if (pokemonRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um Pokémon com o id " + id);
        }
        return pokemonRepository.save(new Pokemon(id, pokemon.name(), pokemon.stats(), pokemon.types()));
    }

    public Pokemon atualizar(Integer id, Pokemon pokemon) {
        validar(pokemon);
        if (!pokemonRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pokémon " + id + " não encontrado");
        }
        return pokemonRepository.save(new Pokemon(id, pokemon.name(), pokemon.stats(), pokemon.types()));
    }

    public void remover(Integer id) {
        if (!pokemonRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pokémon " + id + " não encontrado");
        }
        pokemonRepository.deleteById(id);
    }

    private void validar(Pokemon pokemon) {
        if (pokemon == null || pokemon.name() == null || pokemon.name().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O nome do Pokémon é obrigatório");
        }
    }
}
