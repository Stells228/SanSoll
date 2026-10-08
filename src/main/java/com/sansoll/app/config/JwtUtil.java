package com.sansoll.app.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    private static final String SECRET_STRING = "sansollSecretKeyForJwtSigning1234567890";
    private static final long EXPIRATION_MS = 24 * 60 * 60 * 1000L; // 24 часа
    private static final String CLAIM_VERSION = "v";

    private final Key key = Keys.hmacShaKeyFor(SECRET_STRING.getBytes());

    public String generateToken(String username, Integer version) {
        return Jwts.builder()
                .setSubject(username)
                .claim(CLAIM_VERSION, version != null ? version : 0)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(key)
                .compact();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public Integer extractVersion(String token) {
        Object v = extractAllClaims(token).get(CLAIM_VERSION);
        if (v == null) return 0;
        return ((Number) v).intValue();
    }

    public boolean validateToken(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}