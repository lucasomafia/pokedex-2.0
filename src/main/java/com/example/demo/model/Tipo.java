package com.example.demo.model;

import org.springframework.data.mongodb.core.mapping.Field;

public record Tipo(@Field("id") Integer id, String name) {
}
