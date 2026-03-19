package dev.akarshmi.scholrforge.common.helper;


import dev.akarshmi.scholrforge.auth.dto.TokenResponseDto;
import dev.akarshmi.scholrforge.project.dto.Author;
import dev.akarshmi.scholrforge.project.dto.ProjectResponseDto;
import dev.akarshmi.scholrforge.project.entity.Project;
import dev.akarshmi.scholrforge.user.dto.UserDto;
import dev.akarshmi.scholrforge.user.dto.UserResponseDto;
import dev.akarshmi.scholrforge.user.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapperInterface {

    UserDto toUserDto(User user);
    User toUserEntity(UserDto dto);

    List<UserDto> toDtoList(List<User> users);

    UserResponseDto toResponseDto(User user);
    List<UserResponseDto> toResponseAllDto(List<User> users);

    TokenResponseDto toTokenResponseDto(User user);

}