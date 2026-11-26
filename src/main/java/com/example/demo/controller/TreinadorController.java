package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Treinador;
import com.example.demo.service.TreinadorService;

@RestController
@RequestMapping("/api/trainers")
public class TreinadorController {

    private final TreinadorService treinadorService;

    public TreinadorController(TreinadorService treinadorService) {
        this.treinadorService = treinadorService;
    }

    @GetMapping
    public List<Treinador> listar() {
        return treinadorService.listar();
    }

    @GetMapping("/{id}")
    public Treinador buscarPorId(@PathVariable Integer id) {
        return treinadorService.buscarPorId(id);
    }
}
