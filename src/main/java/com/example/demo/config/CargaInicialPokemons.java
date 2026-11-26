package com.example.demo.config;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.demo.model.Estatisticas;
import com.example.demo.model.Pokemon;
import com.example.demo.model.Tipo;
import com.example.demo.repository.PokemonRepository;

@Component
public class CargaInicialPokemons implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(CargaInicialPokemons.class);

    private final PokemonRepository pokemonRepository;

    public CargaInicialPokemons(PokemonRepository pokemonRepository) {
        this.pokemonRepository = pokemonRepository;
    }

    @Override
    public void run(String... argumentos) throws IOException {
        if (pokemonRepository.count() > 0) {
            log.info("Coleção pokemons já populada, carga inicial ignorada");
            return;
        }
        if (!LeitorScriptPokedex.scriptExiste()) {
            log.warn("Arquivo {} não encontrado, carga inicial ignorada", LeitorScriptPokedex.CAMINHO_SCRIPT.toAbsolutePath());
            return;
        }

        Map<String, List<List<String>>> tabelas = LeitorScriptPokedex.lerTabelas();

        Map<Integer, Tipo> tiposPorId = new HashMap<>();
        for (List<String> linha : tabelas.get("Types")) {
            int idTipo = Integer.parseInt(linha.get(0));
            tiposPorId.put(idTipo, new Tipo(idTipo, linha.get(1)));
        }

        Map<Integer, List<Tipo>> tiposPorPokemon = new HashMap<>();
        for (List<String> linha : tabelas.get("Rel_Pokemon_Type")) {
            int idPokemon = Integer.parseInt(linha.get(0));
            Tipo tipo = tiposPorId.get(Integer.parseInt(linha.get(1)));
            tiposPorPokemon.computeIfAbsent(idPokemon, chave -> new ArrayList<>()).add(tipo);
        }

        List<Pokemon> pokemons = new ArrayList<>();
        for (List<String> linha : tabelas.get("Pokemon")) {
            int idPokemon = Integer.parseInt(linha.get(0));
            Estatisticas estatisticas = new Estatisticas(
                    Integer.parseInt(linha.get(2)),
                    Integer.parseInt(linha.get(3)),
                    Integer.parseInt(linha.get(4)),
                    Integer.parseInt(linha.get(5)),
                    Integer.parseInt(linha.get(6)),
                    Integer.parseInt(linha.get(7)));
            pokemons.add(new Pokemon(idPokemon, linha.get(1), estatisticas,
                    tiposPorPokemon.getOrDefault(idPokemon, List.of())));
        }

        pokemonRepository.saveAll(pokemons);
        log.info("Carga inicial concluída: {} pokémons inseridos", pokemons.size());
    }
}
