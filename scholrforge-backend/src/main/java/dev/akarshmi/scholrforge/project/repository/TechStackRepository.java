package dev.akarshmi.scholrforge.project.repository;

import dev.akarshmi.scholrforge.project.entity.TechStack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface TechStackRepository extends JpaRepository<TechStack, UUID> {
    Optional<TechStack> findByNameIgnoreCase(String name);
}
