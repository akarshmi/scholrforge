package dev.akarshmi.scholrforge.auth.exception.validation;

public class UserDoesNotExistsException extends RuntimeException {
    public UserDoesNotExistsException(String message) {
        super(message);
    }
    public UserDoesNotExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}
