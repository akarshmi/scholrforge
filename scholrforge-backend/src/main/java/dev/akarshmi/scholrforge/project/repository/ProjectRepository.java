package dev.akarshmi.scholrforge.project.repository;

import dev.akarshmi.scholrforge.project.entity.Project;
import dev.akarshmi.scholrforge.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    List<Project> findByUser(User user);
    boolean existsBySlug(String slug);
    List<Project> findAllByOrderByCreatedAtDesc();
    Page<Project> findByUser(User user, Pageable pageable);
    List<Project> findAllByOrderByUpdatedAtDesc();

}
