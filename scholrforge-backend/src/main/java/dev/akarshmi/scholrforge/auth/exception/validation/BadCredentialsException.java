package dev.akarshmi.scholrforge.auth.exception.validation;

public class BadCredentialsException extends RuntimeException {
    public BadCredentialsException(String message) {
        super(message);
    }
}
