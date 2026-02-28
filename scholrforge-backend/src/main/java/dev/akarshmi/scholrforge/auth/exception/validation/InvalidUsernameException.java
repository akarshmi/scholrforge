package dev.akarshmi.scholrforge.auth.exception.validation;

public class InvalidUsernameException extends RuntimeException{
    public InvalidUsernameException(String message) {
        super(message);
    }
}
