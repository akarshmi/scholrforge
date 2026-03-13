package dev.akarshmi.scholrforge.common.helper;

import dev.akarshmi.scholrforge.project.dto.ProjectDto;
import dev.akarshmi.scholrforge.project.dto.ProjectResponseDto;
import dev.akarshmi.scholrforge.project.entity.Project;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProjectMapper {
    ProjectDto toProjectDto(Project project);
    List<ProjectDto> toProjectDtos(List<Project> projects);
    ProjectResponseDto toResponseDto(Project project);

}