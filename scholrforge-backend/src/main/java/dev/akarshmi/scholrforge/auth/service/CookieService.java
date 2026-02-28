package dev.akarshmi.scholrforge.auth.service;

import jakarta.servlet.http.HttpServletResponse;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Getter
@Setter
@Service
public class CookieService {

    private final String refreshTokenCookieName;
    private final boolean cookieHttpOnly;
    private final boolean cookieSecure;
    private final String cookieSameSite;
    private final String cookieDomain;


    public CookieService(
            @Value("${scholrforge.auth.jwt.REFRESH-TOKEN-COOKIE-NAME}") String refreshTokenCookieName,
            @Value("${scholrforge.auth.jwt.HTTPS-ONLY}") boolean cookieHttpOnly,
            @Value("${scholrforge.auth.jwt.COOKIE-SECURE}") boolean cookieSecure,
            @Value("${scholrforge.auth.jwt.COOKIE-SAME-SITE}") String cookieSameSite,
            @Value("${scholrforge.auth.jwt.COOKIE-DOMAIN}") String cookieDomain
    ){
        this.refreshTokenCookieName = refreshTokenCookieName;
        this.cookieHttpOnly = cookieHttpOnly;
        this.cookieSecure = cookieSecure;
        this.cookieSameSite = cookieSameSite;
        this.cookieDomain = cookieDomain;
    }

// method to attachRefreshToken in response
    public void attachRefreshCookie(HttpServletResponse response,String refreshToken, int maxAge){
        ResponseCookie.ResponseCookieBuilder responseCookieBuilder = ResponseCookie.from(refreshTokenCookieName,refreshToken)
                .httpOnly(cookieHttpOnly)
                .secure(cookieSecure)
                .sameSite(cookieSameSite)
                .path("/")
                .domain(cookieDomain)
                .maxAge(maxAge);
        ResponseCookie responseCookie = responseCookieBuilder.build();
        response.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());
    }

    public void clearRefreshCookie(HttpServletResponse response){
        ResponseCookie.ResponseCookieBuilder responseCookieBuilder = ResponseCookie.from(refreshTokenCookieName,"")
                .httpOnly(cookieHttpOnly)
                .secure(cookieSecure)
                .sameSite(cookieSameSite)
                .path("/")
                .domain(cookieDomain)
                .maxAge(0);
        ResponseCookie responseCookie = responseCookieBuilder.build();
        response.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());
    }

    public void addNoStoreHeaders(HttpServletResponse response) {
        response.addHeader(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, max-age=0");
        response.addHeader(HttpHeaders.PRAGMA, "no-cache");
    }

}
