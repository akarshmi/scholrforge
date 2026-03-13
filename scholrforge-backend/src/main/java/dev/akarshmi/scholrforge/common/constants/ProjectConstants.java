package dev.akarshmi.scholrforge.common.constants;

 public final class ProjectConstants {
  public final static String PROJECT_BASE_URL = "/api/v4/projects";

  //Security Exception
  public final static String UNAUTHORIZED_ACCESS = "Unauthorized";

// PROJECT VALIDATION
  public static final String PROJECT_TITLE_NOT_BLANK = "Project title cannot be blank";
  public static final String PROJECT_TITLE_SIZE = "Project title cannot exceed 150 characters";
  public static final String PROJECT_TITLE_SIZE_AND_PATTERN = "Project title must be between 3 and 150 characters";

  public static final String PROJECT_DESCRIPTION_NOT_BLANK = "Project description cannot be blank";
  public static final String PROJECT_DESCRIPTION_SIZE = "Project description cannot exceed 2000 characters";

  public static final String PROJECT_REPOSITORY_URL_INVALID = "Invalid repository URL";
  public static final String PROJECT_DEMO_URL_INVALID = "Invalid demo URL";

  public static final String PROJECT_TECH_STACK_REQUIRED = "Tech stack cannot be empty";
  public static final String PROJECT_TYPE_REQUIRED = "Project type is required";
  public static final String PROJECT_DIFFICULTY_LEVEL_REQUIRED = "Difficulty level is required";



// PROJECT BUSINESS LOGIC
  public static final String PROJECT_NOT_FOUND = "Project not found with ID: %s";
  public static final String PROJECT_ACCESS_DENIED = "You do not have permission to modify this project";
  public static final String PROJECT_ALREADY_EXISTS = "Project with the same name already exists";

// PROJECT OPERATIONS
public static final String PROJECT_CREATED_SUCCESS = "Project created successfully";
  public static final String PROJECT_UPDATED_SUCCESS = "Project updated successfully";
  public static final String PROJECT_DELETED_SUCCESS = "Project deleted successfully";

  public static final String PROJECT_FETCH_SUCCESS = "Project retrieved successfully";
  public static final String PROJECT_LIST_FETCH_SUCCESS = "Projects retrieved successfully";

// PROJECT SEARCH

  public static final String PROJECT_SEARCH_KEYWORD_EMPTY = "Search keyword cannot be empty";
  public static final String PROJECT_SEARCH_NO_RESULTS = "No projects found matching the search criteria";

  // PROJECT DOWNLOAD / TRENDING
  public static final String PROJECT_DOWNLOAD_RECORDED = "Project download recorded";
  public static final String PROJECT_DOWNLOAD_URL_SIZE_EXCEEDED = "Project download recorded";
  public static final String PROJECT_DOWNLOAD_URL_INVALID = "Project download URL is Invalid";
  public static final String PROJECT_TRENDING_FETCH_SUCCESS = "Trending projects retrieved successfully";

// PROJECT GENERIC ERRORS

  public static final String PROJECT_CREATION_FAILED = "Failed to create project";
  public static final String PROJECT_UPDATE_FAILED = "Failed to update project";
  public static final String PROJECT_DELETE_FAILED = "Failed to delete project";

  //Unexpected Error
  public static final String UNEXPECTED_ERROR = "Unexpected error";

}
