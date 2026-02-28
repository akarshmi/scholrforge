package dev.akarshmi.scholrforge.auth.dto;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

public record ApiErrorDto(
        int status,
        String error,
        String message,
        String path,
        OffsetDateTime timestamp
) {
    public static ApiErrorDto of(int status, String error, String message, String path){
        return new ApiErrorDto(status,error,message,path,OffsetDateTime.now(ZoneOffset.UTC));
    }
}