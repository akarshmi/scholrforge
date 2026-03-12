package dev.akarshmi.scholrforge.common.constants;

public final class UserConstants {
    private UserConstants() {
        // Prevent instantiation
    }

    public static final String USER_BASE_URL = "/api/v4/users";

    public static final String USER_ID_CANNOT_BE_NULL = "User ID cannot be null";
    public static final String USER_ID_INVALID = "Invalid user ID";

    public static final String FIRST_NAME_NOT_BLANK = "First name cannot be blank";
    public static final String FIRST_NAME_SIZE = "First name cannot exceed 50 characters";

    public static final String LAST_NAME_NOT_BLANK = "Last name cannot be blank";
    public static final String LAST_NAME_SIZE = "Last name cannot exceed 50 characters";

    public static final String FULL_NAME_SIZE = "Full name cannot exceed 100 characters";

    public static final String BIO_SIZE = "Bio cannot exceed 500 characters";

    public static final String PROFILE_PICTURE_INVALID = "Invalid profile picture format";
    public static final String PROFILE_PICTURE_SIZE = "Profile picture size exceeds allowed limit";

    public static final String PHONE_NOT_VALID = "Invalid phone number format";

    public static final String DATE_OF_BIRTH_INVALID = "Invalid date of birth";
    public static final String DATE_OF_BIRTH_FUTURE = "Date of birth cannot be in the future";

    public static final String USER_NOT_FOUND = "User not found with ID: %s";
    public static final String USER_ALREADY_EXISTS = "User already exists";
    public static final String USER_CREATION_FAILED = "Failed to create user";
    public static final String USER_UPDATE_FAILED = "Failed to update user";
    public static final String USER_DELETION_FAILED = "Failed to delete user";

    public static final String USER_DEACTIVATED = "User account has been deactivated";
    public static final String USER_ACTIVATED = "User account has been activated";

    public static final String USER_BLOCKED = "User account has been blocked";
    public static final String USER_UNBLOCKED = "User account has been unblocked";

    public static final String PAGE_NUMBER_INVALID = "Page number must be greater than or equal to 0";
    public static final String PAGE_SIZE_INVALID = "Page size must be greater than 0";

    public static final String SORT_DIRECTION_INVALID = "Invalid sort direction";
    public static final String SORT_FIELD_INVALID = "Invalid sort field";

    public static final String ACCESS_DENIED_USER_RESOURCE = "You do not have permission to access this user resource";
    public static final String CANNOT_MODIFY_OTHER_USER = "You cannot modify another user's data";

    public static final String USER_OPERATION_SUCCESS = "User operation completed successfully";
    public static final String USER_LIST_EMPTY = "No users found";
}
