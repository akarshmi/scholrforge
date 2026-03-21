package dev.akarshmi.scholrforge.project.repository;

import dev.akarshmi.scholrforge.project.entity.Project;
import dev.akarshmi.scholrforge.project.entity.ProjectStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    boolean existsBySlug(String slug);
    List<Project> findByUserId(UUID userId, Pageable pageable);  // fixed
    List<Project> findAllByOrderByCreatedAtDesc(Pageable pageable);
    List<Project> findAllByOrderByUpdatedAtDesc();
    List<Project> findByProjectTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String title,
            String description,
            Pageable page
    );
//    Project findBySlugWithinIgnoreCase(String slug);
    Project findBySlug(String slug);

    List<Project> findByUserIdAndStatus(UUID userId, ProjectStatus status, Pageable pageable);

    List<Project> findAllByStatus(ProjectStatus status);

    List<Project> findAllByStatusIn(Collection<ProjectStatus> statuses);
}
