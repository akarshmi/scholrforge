package dev.akarshmi.scholrforge.project.exceptions;

public class ProjectDoesNotExistsException extends RuntimeException{
    public ProjectDoesNotExistsException(String message){
        super(message);
    }
}
