package com.project.safe.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;

// 자동 Bean 등록되도록, 컨트롤러에서 @Autowired X
@Component
public class JwtUtil {

    // 비밀키 정의(HMAC-SHA 방식)
    private static final Key SECRET_KEY = Keys.hmacShaKeyFor(
            "abcdefghijklmnopqrstuvwxzy123456".getBytes(StandardCharsets.UTF_8) // 🔐 비밀키
    );

    public String getUserIdFromToken(String token) {
        token = token.replace("Bearer ", "").trim(); // Bearer 제거
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY) // 서명 검증에 쓸 키 지정
                .build()
                .parseClaimsJws(token) // 토큰 파싱하면서 서명 검증
                .getBody();

        return claims.getSubject(); // userId 반환
    }
}