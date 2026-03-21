package dev.akarshmi.scholrforge.common.helper;

import dev.akarshmi.scholrforge.project.dto.Author;
import dev.akarshmi.scholrforge.project.dto.ProjectDto;
import dev.akarshmi.scholrforge.project.dto.ProjectResponseDto;
import dev.akarshmi.scholrforge.project.entity.Project;
import dev.akarshmi.scholrforge.user.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProjectMapper {
    ProjectDto toProjectDto(Project project);
    List<ProjectDto> toProjectDtos(List<Project> projects);
//    ProjectResponseDto toResponseDto(Project project);
    List<ProjectResponseDto> toResponseDtoList(List<Project> project);


    @Mapping(target = "author", ignore = true) // set manually
    ProjectResponseDto toDto(Project project);

    // Convenience method with author
    default ProjectResponseDto toDto(Project project, Author author) {
        ProjectResponseDto dto = toDto(project);
        return new ProjectResponseDto(
                dto.id(),
                dto.userId(),
                author,           // ← injected
                dto.projectTitle(),
                dto.slug(),
                dto.description(),
                dto.projectType(),
                dto.difficultyLevel(),
                dto.status(),
                dto.githubUrl(),
                dto.downloadUrl(),
                dto.demoVideoUrl(),
                dto.viewCount(),
                dto.downloadCount(),
                dto.avgRating(),
                dto.techStack(),
                dto.tags(),
                dto.createdAt(),
                dto.updatedAt()
        );
    }

}