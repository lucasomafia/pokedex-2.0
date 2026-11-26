package com.example.demo.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Pokemon;
import com.example.demo.service.PokemonService;

@RestController
@RequestMapping("/api/pokemons")
public class PokemonController {

    private final PokemonService pokemonService;

    public PokemonController(PokemonService pokemonService) {
        this.pokemonService = pokemonService;
    }

    @GetMapping
    public List<Pokemon> listarTodos() {
        return pokemonService.listarTodos();
    }

    @GetMapping("/{id}")
    public Pokemon buscarPorId(@PathVariable Integer id) {
        return pokemonService.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<Pokemon> cadastrar(@RequestBody Pokemon pokemon) {
        Pokemon cadastrado = pokemonService.cadastrar(pokemon);
        return ResponseEntity.created(URI.create("/api/pokemons/" + cadastrado.id())).body(cadastrado);
    }

    @PutMapping("/{id}")
    public Pokemon atualizar(@PathVariable Integer id, @RequestBody Pokemon pokemon) {
        return pokemonService.atualizar(id, pokemon);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Integer id) {
        pokemonService.remover(id);
        return ResponseEntity.noContent().build();
    }
}
