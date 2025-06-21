package com.project.safe.controller;

import com.project.safe.domain.Member;
import com.project.safe.dto.UserDTO;
import com.project.safe.repository.MemberRepository;
import com.project.safe.service.MemberService;
import com.project.safe.config.JwtUtil;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Key;
import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class MemberController {

    private final MemberService memberService;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // 생성자 기반 주입
    private static final Key SECRET_KEY = Keys.hmacShaKeyFor(
            "abcdefghijklmnopqrstuvwxzy123456".getBytes() // 32바이트 이상 키 필수
    );

    public MemberController(MemberService memberService,
            MemberRepository memberRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.memberService = memberService;
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // 회원가입, UserDTO로 받은 유저 정보를 넘김
    @PostMapping("/register")
    public String register(@RequestBody UserDTO dto) {
        try {
            memberService.register(dto);
            return dto.getNickname() + "님, 어서오세요!";
        } catch (RuntimeException e) {
            return e.getMessage();
        }
    }

    // 로그인 + JWT 토큰 발급(토큰의 subject에 userId 저장)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO dto) {
        Member member = memberRepository.findByUserId(dto.getUserId());

        if (member == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "존재하지 않는 아이디입니다."));
        }

        if (!passwordEncoder.matches(dto.getUserPw(), member.getUserPw())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "비밀번호가 일치하지 않습니다."));
        }

        String token = Jwts.builder()
                .setSubject(member.getUserId())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();

        return ResponseEntity.ok(Map.of(
                "token", token,
                "userKey", member.getUserKey(),
                "nickname", member.getNickname()));
    }

    // 토큰 기반 사용자 정보 확인
    @GetMapping("/me")
    // public ResponseEntity<?> me(@RequestHeader(value = "Authorization", required
    // = false) String authHeader) {
    // if (authHeader == null || !authHeader.startsWith("Bearer ")) {
    // return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error",
    // "토큰이 없습니다."));
    // }

    // String userId = jwtUtil.getUserIdFromToken(authHeader);
    // Member member = memberRepository.findByUserId(userId);

    // if (member == null) {
    // return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
    // .body(Map.of("error", "사용자를 찾을 수 없습니다."));
    public ResponseEntity<?> me(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "토큰이 없습니다."));
        }

        String userId = jwtUtil.getUserIdFromToken(authHeader);
        Member member = memberRepository.findByUserId(userId);

        if (member == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "사용자를 찾을 수 없습니다."));
        }

        return ResponseEntity.ok(Map.of(
                "userId", member.getUserId(),
                "nickname", member.getNickname(),
                "email", member.getUserEmail()));
    }

    // // 프론트에서 표시할 정보 넘김
    // return
    // ResponseEntity.ok(Map.of("userId",member.getUserId(),"nickname",member.getNickname(),"email",member.getUserEmail()));

    // 아이디 중복 확인
    @GetMapping("/check-id")
    public ResponseEntity<Map<String, Boolean>> checkUserId(@RequestParam String id) {
        boolean duplicate = memberRepository.existsByUserId(id);
        return ResponseEntity.ok(Map.of("duplicate", duplicate));
    }

    // 이메일 중복 확인
    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        boolean duplicate = memberRepository.existsByUserEmail(email);
        return ResponseEntity.ok(Map.of("duplicate", duplicate));
    }
}