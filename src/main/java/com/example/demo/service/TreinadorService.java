package com.example.demo.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.model.Treinador;
import com.example.demo.repository.TreinadorRepository;

@Service
public class TreinadorService {

    private final TreinadorRepository treinadorRepository;

    public TreinadorService(TreinadorRepository treinadorRepository) {
        this.treinadorRepository = treinadorRepository;
    }

    public List<Treinador> listar() {
        return treinadorRepository.findAll(Sort.by("id"));
    }

    public Treinador buscarPorId(Integer id) {
        return treinadorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Treinador " + id + " não encontrado"));
    }
}
