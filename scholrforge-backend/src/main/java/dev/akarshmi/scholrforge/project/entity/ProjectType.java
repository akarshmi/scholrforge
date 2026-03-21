package dev.akarshmi.scholrforge.project.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum ProjectType {
    WEB,
    MOBILE,
    AI,
    MACHINE_LEARNING,
    DESKTOP,
    EMBEDDED,
    IOT;

    @JsonCreator
    public static ProjectType from(String value) {
        return valueOf(value.trim().toUpperCase());
    }
}
