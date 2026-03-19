package dev.akarshmi.scholrforge.auth.exception;

import dev.akarshmi.scholrforge.auth.dto.ErrorResponseDto;
import dev.akarshmi.scholrforge.auth.exception.validation.*;
import dev.akarshmi.scholrforge.common.constants.AuthConstants;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;


import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalAuthExceptionHandler {

    @ExceptionHandler({
            InvalidUsernameException.class,
            InvalidNameException.class
    })
    public ResponseEntity<ErrorResponseDto> handleInvalidRequestException(RuntimeException ex, HttpServletRequest request){
        HttpStatus status = HttpStatus.BAD_REQUEST;
        ErrorResponseDto error = new ErrorResponseDto(
                ex.getMessage(),
                status.value(),
                status.getReasonPhrase(),
                request.getRequestURI(),
                LocalDateTime.now()
        );

        return new ResponseEntity<>(error, status);
    }


    @ExceptionHandler({
            EmailAlreadyExistsException.class,
            UsernameAlreadyExistsException.class
    })
    public ResponseEntity<ErrorResponseDto> handleConflictRequest(RuntimeException ex, HttpServletRequest request){
        HttpStatus status = HttpStatus.CONFLICT;
        ErrorResponseDto error = new ErrorResponseDto(
                ex.getMessage(),
                status.value(),
                status.getReasonPhrase(),
                request.getRequestURI(),
                LocalDateTime.now()
        );

        return new ResponseEntity<>(error, status);
    }

    @ExceptionHandler({
            UserDoesNotExistsException.class
    })
    public ResponseEntity<ErrorResponseDto> handleDoesNotExistsException(RuntimeException ex, HttpServletRequest request){
        HttpStatus status = HttpStatus.NOT_FOUND;
        ErrorResponseDto error = new ErrorResponseDto(
                ex.getMessage(),
                status.value(),
                status.getReasonPhrase(),
                request.getRequestURI(),
                LocalDateTime.now()
        );

        return new ResponseEntity<>(error, status);
    }



    @ExceptionHandler({
            BadCredentialsException.class,
            DisabledException.class,
            LockedException.class
    })
    public ResponseEntity<ErrorResponseDto> handleBadCredentialsException(
            RuntimeException ex, HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.UNAUTHORIZED;
        ErrorResponseDto error = new ErrorResponseDto(
                AuthConstants.INVALID_CREDENTIALS,
                status.value(),
                status.getReasonPhrase(),
                request.getRequestURI(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(error, status);
    }


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDto> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> capitalize(err.getField()) + ": " + err.getDefaultMessage())
                .collect(Collectors.joining(", "));

        ErrorResponseDto error = new ErrorResponseDto(
                message,
                status.value(),
                status.getReasonPhrase(),
                request.getRequestURI(),
                LocalDateTime.now()
        );

        return new ResponseEntity<>(error, status);
    }

    @ExceptionHandler(AuthException.class)
    public ResponseEntity<ErrorResponseDto> handleAuthException(
            Exception ex,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.UNAUTHORIZED;
        ErrorResponseDto error = new ErrorResponseDto(
                ex.getMessage(),
                status.value(),
                status.getReasonPhrase(),
                request.getRequestURI(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(error, status);
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDto> handleException(
            Exception ex,
            HttpServletRequest request
    ) {

        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        ErrorResponseDto error = new ErrorResponseDto(
                ex.getMessage(),
                status.value(),
                status.getReasonPhrase(),
                request.getRequestURI(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(error, status);
    }



    private String capitalize(String msg) {
        if (msg == null || msg.isEmpty()) return msg;
        return msg.substring(0, 1).toUpperCase() + msg.substring(1);
    }

}
