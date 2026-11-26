package com.example.demo.config;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class LeitorScriptPokedex {

    public static final Path CAMINHO_SCRIPT = Path.of("Script_Pokedex.sql");
    private static final Pattern PADRAO_INSERT = Pattern.compile(
            "INSERT INTO\\s+(\\w+)\\s*\\([^)]*\\)\\s*VALUES(.*?);", Pattern.DOTALL);
    private static final Pattern PADRAO_LINHA = Pattern.compile("\\(([^()]*)\\)");

    private LeitorScriptPokedex() {
    }

    public static boolean scriptExiste() {
        return Files.exists(CAMINHO_SCRIPT);
    }

    public static Map<String, List<List<String>>> lerTabelas() throws IOException {
        String script = Files.readString(CAMINHO_SCRIPT, StandardCharsets.UTF_8);
        Map<String, List<List<String>>> tabelas = new LinkedHashMap<>();
        Matcher insert = PADRAO_INSERT.matcher(script);
        while (insert.find()) {
            List<List<String>> linhas = new ArrayList<>();
            Matcher linha = PADRAO_LINHA.matcher(insert.group(2));
            while (linha.find()) {
                linhas.add(lerValores(linha.group(1)));
            }
            tabelas.put(insert.group(1), linhas);
        }
        return tabelas;
    }

    private static List<String> lerValores(String linha) {
        List<String> valores = new ArrayList<>();
        for (String valor : linha.split(",")) {
            String limpo = valor.trim();
            if (limpo.startsWith("'") && limpo.endsWith("'")) {
                limpo = limpo.substring(1, limpo.length() - 1).replace("''", "'");
            }
            valores.add(limpo);
        }
        return valores;
    }
}
