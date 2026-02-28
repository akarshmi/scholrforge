package dev.akarshmi.scholrforge.auth.exception.validation;

import dev.akarshmi.scholrforge.auth.exception.BusinessException;

public class EmailAlreadyExistsException extends BusinessException {
    public EmailAlreadyExistsException(String message) {
        super(message, "EMAIL_ALREADY_EXISTS");
    }

    public EmailAlreadyExistsException(String email, String message) {
        super(String.format(message, email), "EMAIL_ALREADY_EXISTS");
    }
}