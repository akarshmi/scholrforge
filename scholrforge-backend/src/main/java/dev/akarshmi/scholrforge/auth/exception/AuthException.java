package dev.akarshmi.scholrforge.auth.exception;

import dev.akarshmi.scholrforge.auth.exception.validation.InvalidUsernameException;

public class AuthException extends InvalidUsernameException {

    public AuthException(String message) {
        super(message);
    }
}
