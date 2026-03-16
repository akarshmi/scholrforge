/**
 * scholrforge TypeScript DTOs for API responses
 */

// ============================================================================
// USER TYPES
// ============================================================================

export interface UserDto {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  socialLinks?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
  role: 'user' | 'admin' | 'moderator';
  reputation: number;
  badges: BadgeDto[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileDto extends UserDto {
  projectsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
}

// ============================================================================
// PROJECT TYPES
// ============================================================================

export interface ProjectDto {
  id: string;
  title: string;
  description: string;
  slug: string;
  coverImage?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  semester: string;
  downloads: number;
  stars: number;
  views: number;
  isBookmarked?: boolean;
  author: Pick<UserDto, 'id' | 'username' | 'avatar'>;
  techStack: string[];
  tags: string[];
  license?: string;
  repositoryUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDetailDto extends ProjectDto {
  content: string; // Markdown content
  media: MediaDto[];
  reviews: ReviewDto[];
  relatedProjects: ProjectDto[];
  contributors: UserDto[];
  averageRating: number;
  reviewCount: number;
}

export interface CreateProjectDto {
  title: string;
  description: string;
  content?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  semester: string;
  techStack: string[];
  tags: string[];
  license?: string;
  repositoryUrl?: string;
  coverImage?: File;
  media?: File[];
}

// ============================================================================
// MEDIA TYPES
// ============================================================================

export interface MediaDto {
  id: string;
  url: string;
  type: 'image' | 'video';
  alt?: string;
  order: number;
}

// ============================================================================
// REVIEW TYPES
// ============================================================================

export interface ReviewDto {
  id: string;
  projectId: string;
  author: Pick<UserDto, 'id' | 'username' | 'avatar'>;
  rating: number;
  content: string;
  likes: number;
  dislikes: number;
  replies: ReviewDto[];
  isLiked?: boolean;
  isDisliked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewDto {
  rating: number;
  content: string;
  parentId?: string; // For nested replies
}

// ============================================================================
// BADGE TYPES
// ============================================================================

export interface BadgeDto {
  id: string;
  name: string;
  icon: string;
  description: string;
  criteria?: string;
}

// ============================================================================
// PAGINATION & FILTER TYPES
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface InfiniteQueryResponse<T> {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface ExploreFilters {
  search?: string;
  techStack?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  semester?: string;
  sortBy?: 'trending' | 'recent' | 'stars' | 'downloads';
  page?: number;
  pageSize?: number;
}

// ============================================================================
// AUTH TYPES
// ============================================================================

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponseDto {
  user: UserDto;
  token: string;
  refreshToken?: string;
}

// ============================================================================
// ADMIN TYPES
// ============================================================================

export interface DashboardStatsDto {
  dailyActiveUsers: number;
  totalUsers: number;
  totalProjects: number;
  pendingReviews: number;
  totalDownloads: number;
  totalRegistrations: number;
}

export interface AnalyticsDataDto {
  date: string;
  uploads: number;
  downloads: number;
  newUsers: number;
}

export interface ProjectReviewDto {
  id: string;
  project: ProjectDto;
  author: UserDto;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: UserDto;
  rejectionReason?: string;
}

// ============================================================================
// BOOKMARK TYPES
// ============================================================================

export interface BookmarkDto {
  id: string;
  projectId: string;
  userId: string;
  project?: ProjectDto;
  createdAt: string;
}

// ============================================================================
// SEARCH & AUTOCOMPLETE TYPES
// ============================================================================

export interface SearchResultDto {
  type: 'project' | 'user' | 'tag';
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  url: string;
}

export interface TechStackSuggestionsDto {
  name: string;
  icon: string;
  category: 'language' | 'framework' | 'database' | 'tool';
}
