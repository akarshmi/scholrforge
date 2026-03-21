package dev.akarshmi.scholrforge.project.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum DifficultyLevel {
    BEGINNER,
    INTERMEDIATE,
    ADVANCED;
    @JsonCreator
    public static DifficultyLevel from(String value) {
        return valueOf(value.trim().toUpperCase());
    }
}