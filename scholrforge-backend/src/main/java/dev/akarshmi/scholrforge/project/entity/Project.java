package dev.akarshmi.scholrforge.project.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(
        name = "projects",
        indexes = {
                @Index(name = "idx_project_slug",   columnList = "slug"),
                @Index(name = "idx_project_title",  columnList = "project_title"),
                @Index(name = "idx_project_type",   columnList = "project_type"),
                @Index(name = "idx_project_status", columnList = "status"),
                @Index(name = "idx_project_user",   columnList = "user_id")
        }
)
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;


    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false, length = 150, name = "project_title")
    private String projectTitle;

    @Column(nullable = false, unique = true, length = 200)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "project_type")
    private ProjectType projectType;

    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficultyLevel;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ProjectStatus status = ProjectStatus.DRAFT;

    // Links
    @Column(length = 255)
    private String githubUrl;

    private String fileName;
    private String demoVideoUrl;

    // Relations
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "project_tech_stack",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "tech_stack_id")
    )
    @Builder.Default
    private Set<TechStack> techStack = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "project_tags",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    @Builder.Default
    private Set<Tag> tags = new HashSet<>();

    // Stats
    @Column(nullable = false)
    @Builder.Default
    private Long viewCount = 0L;

    @Column(nullable = false)
    @Builder.Default
    private Long downloadCount = 0L;

    @Builder.Default
    private Double avgRating = 0.0;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}