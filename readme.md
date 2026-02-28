# 🎯 scholrforge

**The Academic Project Intelligence Platform**

> Discover, share, and elevate student innovation through intelligent project curation

scholrforge transforms academic project sharing from scattered repositories into a unified, intelligent marketplace where quality meets discovery.

---

## 🌟 Why scholrforge?

**The Problem:**
- Students waste hours searching for relevant project references
- Quality projects remain buried in forgotten repositories
- No centralized system for academic collaboration
- Zero visibility into project quality before download
- Duplicate efforts across institutions

**The Solution:**
scholrforge provides an intelligent curation layer that surfaces the best student work, validates quality through community engagement, and builds a reputation economy around academic excellence.

---

## 🎯 Core Philosophy

**Three Pillars:**

1. **Discovery Intelligence** - Smart search and recommendations
2. **Quality Curation** - Community-driven validation and admin oversight
3. **Academic Integrity** - Transparent sourcing and proper attribution

---

## ✨ Feature Ecosystem

### 🔐 Identity & Access
- **JWT-based authentication** with refresh token rotation
- **Role hierarchy**: Student → Contributor → Moderator → Admin
- **OAuth integration** ready (GitHub, Google)
- **Email verification** and password recovery
- **Rate limiting** per role tier

### 📚 Project Management
- **Dual hosting model**: GitHub links + ZIP uploads
- **Rich metadata**: tags, tech stack, difficulty level, semester
- **Media support**: demo videos (YouTube/Vimeo), screenshots
- **Version tracking**: project evolution timeline
- **License specification**: MIT, GPL, Apache, etc.
- **Documentation parsing**: auto-extract README content

### 🔍 Discovery Engine
- **Multi-faceted search**: by tech stack, domain, difficulty
- **Smart filtering**: date range, ratings, downloads
- **Tag-based navigation**: hierarchical category system
- **Trending algorithm**: time-decay weighted popularity
- **Personalized feed**: ML-powered recommendations (future)

### ⭐ Engagement System
- **5-star rating system** with review text
- **Upvote/downvote** mechanism
- **Comment threads** with nested replies
- **Project bookmarking** and collections
- **Follow creators** for updates
- **Download tracking** with analytics

### 🏆 Reputation Economy
- **Contributor score**: based on uploads, ratings, engagement
- **Achievement badges**: Pioneer, Top Contributor, Domain Expert
- **Leaderboards**: weekly, monthly, all-time
- **Verified projects**: admin-approved quality seal
- **Featured projects**: editorial picks

### 🛡️ Moderation & Safety
- **Admin dashboard**: approve, reject, flag projects
- **Report system**: spam, plagiarism, inappropriate content
- **Content scanning**: automated checks for sensitive data
- **DMCA compliance**: takedown workflow
- **Audit logs**: full moderation history

### 📊 Analytics & Insights
- **Creator dashboard**: views, downloads, ratings over time
- **Platform metrics**: trending tech stacks, popular domains
- **Export reports**: CSV/JSON data dumps
- **API access**: for academic research

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Applications                       │
│         (Web App · Mobile · CLI · IDE Extensions)           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway Layer                          │
│          (Rate Limiting · Auth · Load Balancing)            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                  Spring Boot REST API                        │
│  ┌──────────────┬──────────────┬──────────────┬─────────┐  │
│  │   Auth       │   Projects   │   Social     │  Admin  │  │
│  │   Service    │   Service    │   Service    │ Service │  │
│  └──────────────┴──────────────┴──────────────┴─────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         ↓           ↓           ↓
┌─────────────┐ ┌─────────┐ ┌──────────────┐
│ PostgreSQL  │ │  Redis  │ │Object Storage│
│  (Primary)  │ │ (Cache) │ │  (S3/Minio)  │
└─────────────┘ └─────────┘ └──────────────┘
         ↓
┌─────────────────────┐
│ Elasticsearch       │
│ (Search Index)      │
└─────────────────────┘
```

### Design Principles
- **Stateless API**: horizontal scalability
- **Event-driven**: async processing for heavy operations
- **Cache-first**: Redis for hot data
- **CDN-ready**: static asset distribution
- **Database per service**: microservices evolution path

---

## 📂 Project Structure

```
scholrforge-backend/
│
├── src/main/java/com/scholrforge/
│   │
│   ├── config/                    # App configuration
│   │   ├── SecurityConfig.java
│   │   ├── CorsConfig.java
│   │   ├── CacheConfig.java
│   │   └── StorageConfig.java
│   │
│   ├── security/                  # Auth & authorization
│   │   ├── jwt/
│   │   │   ├── JwtTokenProvider.java
│   │   │   ├── JwtAuthFilter.java
│   │   │   └── JwtAuthEntryPoint.java
│   │   ├── UserPrincipal.java
│   │   └── CurrentUser.java
│   │
│   ├── auth/                      # Authentication module
│   │   ├── controller/
│   │   │   └── AuthController.java
│   │   ├── service/
│   │   │   ├── AuthService.java
│   │   │   └── EmailService.java
│   │   ├── dto/
│   │   │   ├── LoginRequest.java
│   │   │   ├── RegisterRequest.java
│   │   │   ├── AuthResponse.java
│   │   │   └── TokenRefreshRequest.java
│   │   └── entity/
│   │       └── RefreshToken.java
│   │
│   ├── user/                      # User management
│   │   ├── controller/
│   │   │   └── UserController.java
│   │   ├── service/
│   │   │   ├── UserService.java
│   │   │   └── ReputationService.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   └── BadgeRepository.java
│   │   ├── entity/
│   │   │   ├── User.java
│   │   │   ├── Badge.java
│   │   │   └── UserBadge.java
│   │   └── dto/
│   │       ├── UserProfileDto.java
│   │       └── UserStatsDto.java
│   │
│   ├── project/                   # Project module
│   │   ├── controller/
│   │   │   ├── ProjectController.java
│   │   │   └── ProjectSearchController.java
│   │   ├── service/
│   │   │   ├── ProjectService.java
│   │   │   ├── StorageService.java
│   │   │   ├── GitHubService.java
│   │   │   └── SearchService.java
│   │   ├── repository/
│   │   │   ├── ProjectRepository.java
│   │   │   ├── TagRepository.java
│   │   │   └── TechStackRepository.java
│   │   ├── entity/
│   │   │   ├── Project.java
│   │   │   ├── ProjectType.java (enum)
│   │   │   ├── Tag.java
│   │   │   ├── TechStack.java
│   │   │   └── ProjectMedia.java
│   │   └── dto/
│   │       ├── ProjectCreateDto.java
│   │       ├── ProjectResponseDto.java
│   │       ├── ProjectDetailDto.java
│   │       └── ProjectSearchDto.java
│   │
│   ├── social/                    # Social features
│   │   ├── controller/
│   │   │   ├── RatingController.java
│   │   │   ├── CommentController.java
│   │   │   └── BookmarkController.java
│   │   ├── service/
│   │   │   ├── RatingService.java
│   │   │   ├── CommentService.java
│   │   │   └── BookmarkService.java
│   │   ├── repository/
│   │   │   ├── RatingRepository.java
│   │   │   ├── CommentRepository.java
│   │   │   ├── DownloadRepository.java
│   │   │   └── BookmarkRepository.java
│   │   └── entity/
│   │       ├── Rating.java
│   │       ├── Comment.java
│   │       ├── Download.java
│   │       └── Bookmark.java
│   │
│   ├── admin/                     # Admin module
│   │   ├── controller/
│   │   │   ├── ModerationController.java
│   │   │   ├── BadgeController.java
│   │   │   └── AnalyticsController.java
│   │   ├── service/
│   │   │   ├── ModerationService.java
│   │   │   ├── BadgeService.java
│   │   │   └── AnalyticsService.java
│   │   └── dto/
│   │       ├── ModerationActionDto.java
│   │       └── PlatformStatsDto.java
│   │
│   ├── notification/              # Notification system
│   │   ├── service/
│   │   │   ├── NotificationService.java
│   │   │   └── EmailNotificationService.java
│   │   ├── repository/
│   │   │   └── NotificationRepository.java
│   │   └── entity/
│   │       └── Notification.java
│   │
│   ├── common/                    # Shared utilities
│   │   ├── exception/
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   ├── ResourceNotFoundException.java
│   │   │   ├── BadRequestException.java
│   │   │   └── UnauthorizedException.java
│   │   ├── response/
│   │   │   ├── ApiResponse.java
│   │   │   ├── PagedResponse.java
│   │   │   └── ErrorResponse.java
│   │   ├── utils/
│   │   │   ├── SlugGenerator.java
│   │   │   ├── FileValidator.java
│   │   │   └── DateUtils.java
│   │   └── constants/
│   │       ├── AppConstants.java
│   │       └── RoleConstants.java
│   │
│   └── scholrforgeApplication.java
│
├── src/main/resources/
│   ├── application.yml              # Main config
│   ├── application-dev.yml          # Dev profile
│   ├── application-prod.yml         # Prod profile
│   ├── db/migration/                # Flyway migrations
│   │   ├── V1__init_schema.sql
│   │   ├── V2__add_badges.sql
│   │   └── V3__add_notifications.sql
│   ├── templates/                   # Email templates
│   │   ├── welcome.html
│   │   └── verification.html
│   └── static/
│       └── badges/                  # Badge icons
│
├── src/test/                        # Test suite
│   ├── java/com/scholrforge/
│   │   ├── integration/
│   │   └── unit/
│   └── resources/
│
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── docker-compose.dev.yml
│
├── scripts/
│   ├── setup.sh                     # Initial setup
│   ├── seed-data.sql                # Test data
│   └── backup.sh                    # DB backup
│
├── docs/
│   ├── API.md                       # API documentation
│   ├── ARCHITECTURE.md              # System design
│   ├── DEPLOYMENT.md                # Deployment guide
│   └── CONTRIBUTING.md              # Contribution guide
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── pom.xml
├── .gitignore
├── .env.example
└── README.md
```

---

## 🗄️ Database Schema

### Core Tables

**users**
```sql
id, username, email, password_hash, role, 
reputation_score, created_at, updated_at
```

**projects**
```sql
id, user_id, title, slug, description, 
project_type, github_url, file_path, 
demo_video_url, difficulty_level, semester,
status, view_count, download_count, 
avg_rating, created_at, updated_at
```

**ratings**
```sql
id, project_id, user_id, rating, review_text,
created_at, updated_at
```

**comments**
```sql
id, project_id, user_id, parent_id, 
content, created_at, updated_at
```

**downloads**
```sql
id, project_id, user_id, ip_address, 
created_at
```

**bookmarks**
```sql
id, project_id, user_id, created_at
```

**badges**
```sql
id, name, description, icon_url, 
criteria, created_at
```

**user_badges**
```sql
id, user_id, badge_id, awarded_at
```

**tags**
```sql
id, name, category, created_at
```

**project_tags**
```sql
project_id, tag_id
```

**tech_stacks**
```sql
id, name, icon_url, category
```

**project_tech_stacks**
```sql
project_id, tech_stack_id
```

**notifications**
```sql
id, user_id, type, content, 
is_read, created_at
```

### Indexes & Optimization
- Full-text search on project title/description
- Composite index on (user_id, created_at)
- Index on (status, avg_rating DESC)
- GIN index on tags for array operations

---

## 🔐 Security Implementation

### Authentication Flow
```
1. User registers → Email verification sent
2. User logs in → JWT access + refresh tokens issued
3. Access token (15 min) → Authorization header
4. Refresh token (7 days) → Secure HTTP-only cookie
5. Token expires → Use refresh to get new access token
6. Refresh expires → Re-authentication required
```

### Security Features
- **Password**: BCrypt hashing (strength 12)
- **Tokens**: HMAC-SHA256 signed JWT
- **CORS**: Whitelist-based origin control
- **CSRF**: Token validation for state-changing ops
- **Rate limiting**: 100 req/min per IP
- **Input validation**: JSR-380 annotations
- **SQL injection**: Parameterized queries (JPA)
- **XSS protection**: Content sanitization
- **File upload**: Type/size validation, virus scanning

### Role-Based Access Control

| Role | Permissions |
|------|-------------|
| **GUEST** | Browse, search, view projects |
| **USER** | + Download, rate, comment, bookmark |
| **CONTRIBUTOR** | + Upload projects, edit own projects |
| **MODERATOR** | + Flag content, hide comments |
| **ADMIN** | + Full moderation, badge management, analytics |

---

## 📦 Supported Project Types

### 🌐 GitHub-Linked Projects
- **Storage**: Zero (external link only)
- **Validation**: Repository existence check
- **Features**: Auto-fetch README, star count, language
- **Updates**: Periodic sync with GitHub API

### 📦 Hosted ZIP Projects
- **Max size**: 50 MB
- **Storage**: S3-compatible object storage
- **Security**: Presigned URLs (1-hour expiry)
- **Validation**: Archive structure check
- **Features**: Automatic thumbnail generation

### 🎥 Demo Media
- **Videos**: YouTube, Vimeo embed
- **Images**: PNG, JPG, WebP (5 MB max)
- **CDN**: Cloudflare for image optimization

---

## ⚙️ Technology Stack

### Backend Core
- **Framework**: Spring Boot 3.2
- **Language**: Java 17
- **Build**: Maven
- **Security**: Spring Security 6 + JWT
- **ORM**: Spring Data JPA + Hibernate
- **Validation**: Hibernate Validator

### Data Layer
- **Primary DB**: PostgreSQL 15
- **Cache**: Redis 7
- **Search**: Elasticsearch 8 (future)
- **Storage**: MinIO / AWS S3
- **Migrations**: Flyway

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes (production)
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack

### Frontend (Planned)
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **API Client**: React Query

---

## 🚀 Quick Start Guide

### Prerequisites
```bash
Java 17+
Maven 3.8+
PostgreSQL 15+
Redis 7+
Docker & Docker Compose (optional)
```

### 1. Clone Repository
```bash
git clone https://github.com/akarshmi/scholrforge.git
cd scholrforge
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Database Setup
```bash
# Create database
psql -U postgres -c "CREATE DATABASE scholrforge;"

# Run migrations (automatic on first boot)
./mvnw spring-boot:run
```

### 4. Build & Run
```bash
# Development mode
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Production build
./mvnw clean package
java -jar target/scholrforge-0.0.1-SNAPSHOT.jar
```

### 5. Docker Deployment
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 6. Access Application
```
API: http://localhost:8080
Swagger UI: http://localhost:8080/swagger-ui.html
Health Check: http://localhost:8080/actuator/health
```

### 7. Seed Sample Data
```bash
psql -U postgres -d scholrforge -f scripts/seed-data.sql
```

---

## 📡 API Endpoints Overview

### Authentication
```
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login
POST   /api/auth/refresh           # Refresh access token
POST   /api/auth/logout            # Invalidate tokens
POST   /api/auth/verify-email      # Email verification
POST   /api/auth/forgot-password   # Password reset request
```

### Projects
```
GET    /api/projects               # List all projects (paginated)
GET    /api/projects/{id}          # Get project details
POST   /api/projects               # Create new project
PUT    /api/projects/{id}          # Update project
DELETE /api/projects/{id}          # Delete project
GET    /api/projects/trending      # Get trending projects
GET    /api/projects/search        # Search projects
POST   /api/projects/{id}/download # Track download
```

### Ratings & Reviews
```
POST   /api/projects/{id}/ratings  # Rate a project
GET    /api/projects/{id}/ratings  # Get project ratings
PUT    /api/ratings/{id}           # Update rating
DELETE /api/ratings/{id}           # Delete rating
```

### Comments
```
POST   /api/projects/{id}/comments # Add comment
GET    /api/projects/{id}/comments # Get comments
PUT    /api/comments/{id}          # Update comment
DELETE /api/comments/{id}          # Delete comment
```

### User Profile
```
GET    /api/users/{username}       # Get user profile
PUT    /api/users/me               # Update own profile
GET    /api/users/me/projects      # Get user's projects
GET    /api/users/me/bookmarks     # Get bookmarks
POST   /api/users/{id}/follow      # Follow user
```

### Admin
```
GET    /api/admin/projects/pending # Projects awaiting approval
POST   /api/admin/projects/{id}/approve # Approve project
POST   /api/admin/projects/{id}/reject  # Reject project
GET    /api/admin/statistics       # Platform analytics
POST   /api/admin/badges           # Create badge
```

**Full API documentation**: `/docs/API.md`

---

## 🧪 Testing Strategy

### Unit Tests
```bash
./mvnw test
```

### Integration Tests
```bash
./mvnw verify -P integration-tests
```

### Test Coverage
```bash
./mvnw jacoco:report
# Report: target/site/jacoco/index.html
```

### Performance Testing
```bash
# Using Apache JMeter
jmeter -n -t tests/load-test.jmx -l results.jtl
```

---

## 📊 Monitoring & Analytics

### Application Metrics
- Request latency (p50, p95, p99)
- Error rates per endpoint
- Active user sessions
- Database query performance
- Cache hit/miss ratio

### Business Metrics
- Daily active users
- Project upload rate
- Download trends
- Top tech stacks
- User engagement score

### Dashboards
- **Grafana**: Real-time system metrics
- **Kibana**: Log analysis and debugging
- **Admin Panel**: Business intelligence

---

## 📈 Roadmap

### Phase 1: Foundation ✅
- [x] Authentication system
- [x] Project CRUD operations
- [x] Basic search
- [x] Rating system
- [x] Admin moderation

### Phase 2: Enhancement 🚧
- [ ] Advanced search with Elasticsearch
- [ ] Real-time notifications
- [ ] User following/feed
- [ ] Project collections
- [ ] Email notifications

### Phase 3: Gamification 📋
- [ ] Achievement badges
- [ ] Leaderboards
- [ ] Reputation tiers
- [ ] Contributor rewards
- [ ] Monthly challenges

### Phase 4: Intelligence 🔮
- [ ] ML-powered recommendations
- [ ] Plagiarism detection
- [ ] Auto-tagging with NLP
- [ ] Quality score predictor
- [ ] Similar project finder

### Phase 5: Monetization 💰
- [ ] Premium project hosting
- [ ] Featured listings
- [ ] Recruiter access portal
- [ ] Project templates marketplace
- [ ] Course integration

### Phase 6: Enterprise 🏢
- [ ] Institution accounts
- [ ] White-label deployment
- [ ] SSO integration
- [ ] Analytics API
- [ ] Bulk operations

---

## 🎓 Learning Outcomes

This project demonstrates mastery of:

**Backend Development**
- RESTful API design principles
- Spring Boot ecosystem
- JPA/Hibernate ORM patterns
- Transaction management
- Query optimization

**Security**
- JWT authentication flow
- Role-based access control
- Secure password handling
- OWASP Top 10 mitigation
- API security best practices

**Database Design**
- Normalized schema design
- Indexing strategies
- Query performance tuning
- Migration management
- Relationship modeling

**Architecture**
- Layered architecture pattern
- Separation of concerns
- Dependency injection
- Service-oriented design
- Scalability considerations

**DevOps**
- Docker containerization
- CI/CD pipelines
- Environment management
- Monitoring setup
- Deployment strategies

**Software Engineering**
- Clean code principles
- SOLID principles
- Design patterns
- Unit testing
- Documentation practices

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for new features
4. Ensure all tests pass (`./mvnw test`)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open Pull Request

### Code Style
- Follow Google Java Style Guide
- Use meaningful variable names
- Add Javadoc for public methods
- Keep methods under 50 lines
- Write self-documenting code

---

## 📜 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Spring Framework team for excellent documentation
- PostgreSQL community for robust database
- JWT.io for auth inspiration
- All contributors and testers

---

## 📞 Support

- **Documentation**: [docs.scholrforge.dev](https://docs.scholrforge.dev)
- **Issues**: [GitHub Issues](https://github.com/akarshmi/scholrforge/issues)
- **Discussions**: [GitHub Discussions](https://github.com/akarshmi/scholrforge/discussions)
- **Email**: support@scholrforge.dev

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=akarshmi/scholrforge&type=Date)](https://star-history.com/#akarshmi/scholrforge&Date)

---

<div align="center">

**Built with ❤️ by students, for students**

[Website](https://scholrforge.dev) · [Demo](https://demo.scholrforge.dev) · [Documentation](https://docs.scholrforge.dev)

</div>