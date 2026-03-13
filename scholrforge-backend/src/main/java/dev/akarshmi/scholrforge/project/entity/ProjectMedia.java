package dev.akarshmi.scholrforge.project.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ProjectMedia {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false)
    private String url;

    @Enumerated(EnumType.STRING)
    private MediaType mediaType; // IMAGE, VIDEO, GIF

    private Integer displayOrder;
    private String altText;
}