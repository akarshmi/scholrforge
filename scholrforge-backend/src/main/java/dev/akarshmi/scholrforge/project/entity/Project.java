package dev.akarshmi.scholrforge.project.entity;

import dev.akarshmi.scholrforge.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(
        name = "projects",
        indexes = {
                @Index(name = "idx_project_slug", columnList = "slug"),
                @Index(name = "idx_project_title", columnList = "projectTitle"),
                @Index(name = "idx_project_type", columnList = "projectType"),
                @Index(name = "idx_project_status", columnList = "status")
        }
)
public class Project {

//    id, user_id, title, slug, description,
//    project_type, github_url, file_path,
//    demo_video_url, difficulty_level, semester,
//    status, view_count, download_count,
//    avg_rating, created_at, updated_at

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    private User user;


    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectType projectType;

    @Column(nullable = false, length = 150)
    private String projectTitle;

    @Column(nullable = false, unique = true, length = 200)
    private String slug;

    @Column(length = 255)
    private String githubUrl;
    private String downloadUrl;

    private String demoVideoUrl;

    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficultyLevel;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status;

    @Column(nullable = false)
    private Long viewCount = 0L;

    @Column(nullable = false)
    private Long downloadCount = 0L;

    private Double avgRating = 0.0;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

}
