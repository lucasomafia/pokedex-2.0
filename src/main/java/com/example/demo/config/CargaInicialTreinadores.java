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

import com.example.demo.model.Treinador;
import com.example.demo.repository.TreinadorRepository;

@Component
public class CargaInicialTreinadores implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(CargaInicialTreinadores.class);

    private final TreinadorRepository treinadorRepository;

    public CargaInicialTreinadores(TreinadorRepository treinadorRepository) {
        this.treinadorRepository = treinadorRepository;
    }

    @Override
    public void run(String... argumentos) throws IOException {
        if (treinadorRepository.count() > 0) {
            log.info("Coleção trainers já populada, carga inicial ignorada");
            return;
        }
        if (!LeitorScriptPokedex.scriptExiste()) {
            log.warn("Arquivo {} não encontrado, carga inicial ignorada", LeitorScriptPokedex.CAMINHO_SCRIPT.toAbsolutePath());
            return;
        }

        Map<String, List<List<String>>> tabelas = LeitorScriptPokedex.lerTabelas();

        Map<Integer, List<Integer>> pokemonsPorTreinador = new HashMap<>();
        for (List<String> linha : tabelas.get("Rel_Trainer_Pokemon")) {
            int idTreinador = Integer.parseInt(linha.get(0));
            int idPokemon = Integer.parseInt(linha.get(1));
            pokemonsPorTreinador.computeIfAbsent(idTreinador, chave -> new ArrayList<>()).add(idPokemon);
        }

        List<Treinador> treinadores = new ArrayList<>();
        for (List<String> linha : tabelas.get("Trainers")) {
            int idTreinador = Integer.parseInt(linha.get(0));
            treinadores.add(new Treinador(idTreinador, linha.get(1), Integer.parseInt(linha.get(2)),
                    pokemonsPorTreinador.getOrDefault(idTreinador, List.of())));
        }

        treinadorRepository.saveAll(treinadores);
        log.info("Carga inicial concluída: {} treinadores inseridos", treinadores.size());
    }
}
