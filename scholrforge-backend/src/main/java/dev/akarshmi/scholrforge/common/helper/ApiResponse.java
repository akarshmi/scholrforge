package dev.akarshmi.scholrforge.common.helper;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

public record ApiResponse(
        int status,
        String message,
        OffsetDateTime timestamp
) {
    public static ApiResponse of(int status, String message){
        return new ApiResponse(status,message, OffsetDateTime.now(ZoneOffset.UTC));
    }
}