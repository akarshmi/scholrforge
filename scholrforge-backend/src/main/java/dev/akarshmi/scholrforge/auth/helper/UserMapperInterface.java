package dev.akarshmi.scholrforge.auth.helper;


import dev.akarshmi.scholrforge.auth.dto.TokenResponseDto;
import dev.akarshmi.scholrforge.auth.dto.UserDto;
import dev.akarshmi.scholrforge.auth.dto.UserResponseDto;
import dev.akarshmi.scholrforge.auth.entity.User;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapperInterface {
//    UserDto toDto(User user);
    User toEntity(UserDto dto);
    UserResponseDto toResponseDto(User user);
    TokenResponseDto toTokenResponseDto(User user);
    UserDto toRequestDto(User user);
    List<UserResponseDto> toResponseDto(List<User> users);
    List<UserDto> toDtoList(List<User> users);
}
