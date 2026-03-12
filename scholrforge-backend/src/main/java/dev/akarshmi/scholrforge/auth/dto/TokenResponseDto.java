package dev.akarshmi.scholrforge.auth.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import dev.akarshmi.scholrforge.common.constants.AuthConstants;
import dev.akarshmi.scholrforge.user.dto.UserResponseDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record TokenResponseDto(

        @NotBlank(message = AuthConstants.ACCESS_TOKEN_BLANK)
        @JsonProperty("access_token")
        String accessToken,

        @JsonProperty("refresh_token")
        @JsonInclude(JsonInclude.Include.NON_NULL)
        String refreshToken,

        @Positive(message = AuthConstants.EXPIRATION_MUST_BE_POSITIVE)
        @JsonProperty("expires_in")
        long expiresInSeconds,

        @NotBlank(message = AuthConstants.TOKEN_TYPE_CANT_BE_BLANK)
        @JsonProperty("token_type")
        String tokenType,

        @NotNull(message = AuthConstants.USER_CANT_BE_NULL)
        UserResponseDto user
) {
    public static TokenResponseDto of(String accessToken, String refreshToken,
                                      long expiresInSeconds, UserResponseDto user) {
        return new TokenResponseDto(accessToken, refreshToken,
                expiresInSeconds, "Bearer", user);
    }

//    public static TokenResponseDto of(String accessToken, String refreshToken,
//                                      long expiresInSeconds, String tokenType,
//                                      UserResponseDto user) {
//        return new TokenResponseDto(accessToken, refreshToken,
//                expiresInSeconds, tokenType, user);
//    }

    // Helper methods
    public boolean isExpiringSoon(int thresholdSeconds) {
        return expiresInSeconds < thresholdSeconds;
    }

    public TokenResponseDto withoutRefreshToken() {
        return new TokenResponseDto(accessToken, null,
                expiresInSeconds, tokenType, user);
    }

    public TokenResponseDto withNewTokens(String newAccessToken, String newRefreshToken) {
        return new TokenResponseDto(newAccessToken, newRefreshToken,
                expiresInSeconds, tokenType, user);
    }
}