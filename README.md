# 🔥 ScholrForge

**Where Student Projects Come to Life**

A modern platform for students to share, discover, and download academic projects with intelligent curation and community validation.

---

## 🎯 The Problem

Students struggle to find quality project references. Great work gets lost in scattered repositories. No unified platform exists for academic collaboration.

**ScholrForge solves this.**

---

## ✨ Key Features

### For Students
- 🔐 **Secure Authentication** - Register, login, and manage your account
- 📤 **Upload Projects** - Share GitHub repos or ZIP files
- 🔍 **Smart Search** - Find projects by tech stack, tags, or difficulty
- ⭐ **Rate & Review** - Help others discover quality work
- 💬 **Comment & Discuss** - Engage with project creators
- 📊 **Track Performance** - See downloads, ratings, and engagement

### For Admins
- 🛡️ **Moderation Tools** - Approve, reject, or flag projects
- 🏆 **Badge System** - Reward quality contributors
- 📈 **Analytics Dashboard** - Monitor platform health and trends

---

## 🏗️ Architecture

```
┌─────────────────┐
│   React/Next    │  Frontend (Planned)
└────────┬────────┘
         │
┌────────▼────────┐
│  Spring Boot    │  REST API Layer
│   (Backend)     │
└────────┬────────┘
         │
    ┌────┴────┬──────────┐
    ▼         ▼          ▼
┌────────┐ ┌──────┐ ┌─────────┐
│Postgres│ │Redis │ │S3/MinIO │
│  (DB)  │ │Cache │ │ Storage │
└────────┘ └──────┘ └─────────┘
```

**Stack:**
- Backend: Spring Boot 3.x, Spring Security, JPA
- Database: PostgreSQL
- Cache: Redis (optional)
- Storage: S3-compatible object storage
- Auth: JWT tokens

---

## 📂 Project Structure

```
scholrforge-backend/
│
├── src/main/java/com/scholrforge/
│   ├── auth/                    # Authentication & user management
│   │   ├── controller/          # Login, signup endpoints
│   │   ├── service/             # Auth business logic
│   │   ├── dto/                 # Request/response objects
│   │   └── entity/              # User entity
│   │
│   ├── project/                 # Project management
│   │   ├── controller/          # CRUD operations
│   │   ├── service/             # Business logic
│   │   ├── repository/          # Database access
│   │   ├── entity/              # Project, Tag entities
│   │   └── dto/                 # Project DTOs
│   │
│   ├── social/                  # Ratings, comments, downloads
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   └── entity/
│   │
│   ├── admin/                   # Admin moderation
│   │   ├── controller/
│   │   └── service/
│   │
│   ├── security/                # JWT filters, config
│   │   ├── JwtTokenProvider.java
│   │   ├── JwtAuthFilter.java
│   │   └── SecurityConfig.java
│   │
│   ├── common/                  # Shared utilities
│   │   ├── exception/           # Error handling
│   │   └── response/            # API responses
│   │
│   └── ScholrForgeApplication.java
│
├── src/main/resources/
│   ├── application.yml
│   └── db/migration/            # Database migrations
│
└── pom.xml
```

---

## 🗄️ Database Schema

**users**
- id, username, email, password, role, created_at

**projects**
- id, user_id, title, description, project_type, github_url, file_path, demo_url, tags, status, downloads, avg_rating, created_at

**ratings**
- id, project_id, user_id, rating, review, created_at

**comments**
- id, project_id, user_id, content, created_at

**downloads**
- id, project_id, user_id, created_at

**badges**
- id, name, description, criteria

---

## 🔐 Authentication Flow

1. **Signup**: POST `/api/auth/register` → Email verification (optional)
2. **Login**: POST `/api/auth/login` → Returns JWT access token
3. **Protected Routes**: Include `Authorization: Bearer <token>` header
4. **Refresh**: POST `/api/auth/refresh` → New access token

**Security Features:**
- BCrypt password hashing
- JWT token authentication
- Role-based access control (USER, ADMIN)
- Rate limiting on auth endpoints
- Input validation

---

## 🚀 Quick Start

### Prerequisites
```bash
Java 17+
Maven 3.8+
PostgreSQL 15+
```

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/scholrforge.git
cd scholrforge
```

2. **Configure database**

Create `.env` or edit `application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/scholrforge
    username: your_username
    password: your_password
    
  jpa:
    hibernate:
      ddl-auto: update
      
jwt:
  secret: your-secret-key-here-make-it-long
  expiration: 86400000  # 24 hours
```

3. **Create database**
```bash
psql -U postgres -c "CREATE DATABASE scholrforge;"
```

4. **Run the application**
```bash
./mvnw spring-boot:run
```

5. **Access the API**
```
http://localhost:8080
```

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register        # Create account
POST   /api/auth/login           # Login
POST   /api/auth/refresh         # Refresh token
POST   /api/auth/logout          # Logout
```

### Projects
```
GET    /api/projects             # List all projects
GET    /api/projects/{id}        # Get project details
POST   /api/projects             # Upload new project (auth)
PUT    /api/projects/{id}        # Update project (auth)
DELETE /api/projects/{id}        # Delete project (auth)
GET    /api/projects/search      # Search projects
```

### Ratings & Social
```
POST   /api/projects/{id}/rate   # Rate a project (auth)
POST   /api/projects/{id}/comment # Add comment (auth)
POST   /api/projects/{id}/download # Track download
```

### Admin
```
GET    /api/admin/projects/pending  # Pending approvals
POST   /api/admin/projects/{id}/approve
POST   /api/admin/projects/{id}/reject
```

---

## 🎨 Project Types

### GitHub Projects
- Link to external repositories
- Auto-fetch README and metadata
- Zero storage cost

### Hosted Projects
- Upload ZIP files (max 50MB)
- Stored in object storage
- Secure download URLs

Both types support:
- Demo video links (YouTube/Vimeo)
- Tags and tech stack labels
- Difficulty levels
- Ratings and comments

---

## 🧪 Testing

```bash
# Run unit tests
./mvnw test

# Run with coverage
./mvnw test jacoco:report

# Integration tests
./mvnw verify
```

---

## 🐳 Docker Deployment

```bash
# Build image
docker build -t scholrforge .

# Run with Docker Compose
docker-compose up -d

# Includes: Spring Boot app, PostgreSQL, Redis
```

---

## 📈 Roadmap

**Phase 1 - Core** ✅
- [x] Authentication system
- [x] Project CRUD
- [x] Search and filters
- [x] Rating system

**Phase 2 - Engagement** 🚧
- [ ] Real-time notifications
- [ ] User profiles and following
- [ ] Project collections/bookmarks
- [ ] Advanced search filters

**Phase 3 - Intelligence** 📋
- [ ] ML-powered recommendations
- [ ] Plagiarism detection
- [ ] Auto-tagging with NLP
- [ ] Quality scoring

**Phase 4 - Growth** 🔮
- [ ] Badge and achievement system
- [ ] Leaderboards
- [ ] Premium features
- [ ] Mobile app API

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

MIT License - see [LICENSE](LICENSE) for details

---

## 🛠️ Tech Stack Details

| Layer | Technology |
|-------|-----------|
| Language | Java 17 |
| Framework | Spring Boot 3.2 |
| Security | Spring Security + JWT |
| Database | PostgreSQL 15 |
| ORM | Spring Data JPA |
| Cache | Redis (optional) |
| Storage | S3/MinIO |
| Build | Maven |
| Validation | Hibernate Validator |

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/scholrforge/issues)
- **Docs**: Coming soon
- **Email**: support@scholrforge.dev

---

<div align="center">

**Built by students, for students** 🎓

[Demo](https://demo.scholrforge.dev) · [API Docs](https://docs.scholrforge.dev)

⭐ Star us on GitHub if you find this useful!

</div> 
