package dev.akarshmi.scholrforge.auth.exception.validation;

import dev.akarshmi.scholrforge.constants.AuthConstants;

public class InvalidRefreshTokenException extends RuntimeException {
    public InvalidRefreshTokenException() {
        super(AuthConstants.INVALID_REFRESH_TOKEN);
    }
    public InvalidRefreshTokenException(String message) {
        super(message);
    }
}
