package dev.akarshmi.scholrforge.auth.helper;

import org.springframework.context.annotation.Bean;

import java.util.UUID;

public class UserHelper {

    @Bean
    public static UUID parseUUID(String  uuid) {
        return UUID.fromString(uuid);
    }


}
