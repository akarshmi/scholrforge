package dev.akarshmi.scholrforge.common.constants;

public final class AuthConstants {

    public final static String AUTH_BASE_URL = "/api/v3/auth";

    //Security Exception
    public final static String UNAUTHORIZED_ACCESS = "Unauthorized";


    public static final String USERNAME_NOT_BLANK = "Username cannot be blank";
    public static final String USERNAME_SIZE = "Username must be between 3 and 50 characters";
    public static final String USERNAME_PATTERN = "Username can only contain letters, numbers and underscores";
    public static final String USERNAME_ALREADY_EXISTS = "Username already exists";
    public static final String USERNAME_NOT_FOUND  = "Username not found";


    public static final String EMAIL_NOT_BLANK = "Email cannot be blank";
    public static final String EMAIL_INVALID = "Please provide a valid email address";
    public static final String EMAIL_ALREADY_EXISTS = "Email is already registered";

    public static final String USER_DOES_NOT_EXISTS = "User doesn't exists";
    public static final String USER_CANT_BE_NULL = "User cannot be null";


    public static final String PASSWORD_NOT_BLANK = "Password cannot be blank";
    public static final String PASSWORD_SIZE = "Password must be at least 8 characters";
    public static final String PASSWORD_CONFIRMATION = "Password and confirmation must match";
    public static final String PASSWORD_INCORRECT = "Current password is incorrect";

    public static final String NAME_NOT_BLANK = "Name cannot be blank";
    public static final String NAME_SIZE = "Name cannot exceed 100 characters";

    public static final String PHONE_PATTERN = "Please provide a valid phone number";

    // Business validation messages
    public static final String USER_NOT_FOUND = "User not found with ID: %s";
    public static final String USER_DISABLED = "User account is disabled";
    public static final String EMAIL_NOT_VERIFIED = "Email address not verified";
    public static final String INVALID_CREDENTIALS = "Invalid email or password";

    // Token messages
    public static final String TOKEN_EXPIRED = "Token has expired";
    public static final String TOKEN_INVALID = "Invalid token";
    public static final String TOKEN_NOT_FOUND = "Token not found";
    public static final String TOKEN_MISMATCH = "Token Mismatch";
    public static final String TOKEN_MALFORMED = "Token Malformed";
    public static final String TOKEN_UNSUPPORTED = "Token Unsupported";
    public static final String TOKEN_EMPTY = "Token is Empty";
    public static final String ACCESS_TOKEN_BLANK = "Access token cannot be blank";
    public static final String EXPIRATION_MUST_BE_POSITIVE = "Expires in must be positive";
    public static final String TOKEN_TYPE_CANT_BE_BLANK = "Token type cannot be blank";
    public static final String  REFRESH_TOKEN_NOT_FOUND = "Refresh token not found";
    public static final String  INVALID_REFRESH_TOKEN = "Invalid Refresh Token";
    public static final String  TOKEN_REVOKED = "Token is revoked";

    // Role/Permission messages
    public static final String INSUFFICIENT_PRIVILEGES = "Insufficient privileges to perform this action";
    public static final String ROLE_NOT_FOUND = "Role not found: %s";

    // OAuth messages
    public static final String OAUTH_PROVIDER_NOT_SUPPORTED = "OAuth provider not supported: %s";
    public static final String OAUTH_EMAIL_MISMATCH = "OAuth email does not match registered email";


    //Unexpected Error
    public static final String UNEXPECTED_ERROR = "Unexpected error";

}
