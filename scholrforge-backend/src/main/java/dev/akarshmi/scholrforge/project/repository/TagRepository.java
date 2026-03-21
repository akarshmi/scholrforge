package dev.akarshmi.scholrforge.project.repository;

import dev.akarshmi.scholrforge.project.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface TagRepository extends JpaRepository<Tag, UUID> {
    Set<Tag> findAllByIdIn(Set<UUID> ids);
    Optional<Tag> findByNameIgnoreCase(String name);
}
