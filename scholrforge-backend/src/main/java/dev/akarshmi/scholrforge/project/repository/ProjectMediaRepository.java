package dev.akarshmi.scholrforge.project.repository;

import dev.akarshmi.scholrforge.project.entity.ProjectMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProjectMediaRepository extends JpaRepository<ProjectMedia, UUID> {
}
