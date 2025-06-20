// 서영 0620

package com.project.safe.controller;

import com.project.safe.domain.Member;
import com.project.safe.dto.UserDTO;
import com.project.safe.repository.MemberRepository;
import com.project.safe.service.MemberService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
// @CrossOrigin(origins = "http://localhost:5173") // Docker 환경에서 React 서비스 이름
// 기준
public class MemberController {

    private final MemberService memberService;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public MemberController(MemberService memberService, MemberRepository memberRepository,
            PasswordEncoder passwordEncoder) {
        this.memberService = memberService;
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public String register(@RequestBody UserDTO dto) {
        try {
            memberService.register(dto);
            return dto.getNickname() + "님, 어서오세요!";
        } catch (RuntimeException e) {
            return e.getMessage();
        }
    }

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

        String welcomeMessage = member.getNickname() + "님, 환영합니다!";
        return ResponseEntity.ok(
                Map.of(
                        "message", welcomeMessage,
                        "userId", member.getUserId(), // 프론트에서 저장할 유저 식별값
                        "nickname", member.getNickname() // 프론트에서 보여줄 닉네임
                ));
    }

    @GetMapping("/check-id")
    public ResponseEntity<Map<String, Boolean>> checkUserId(@RequestParam String id) {
        boolean duplicate = memberRepository.existsByUserId(id);
        return ResponseEntity.ok(Map.of("duplicate", duplicate));
    }

    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        boolean duplicate = memberRepository.existsByUserEmail(email);
        return ResponseEntity.ok(Map.of("duplicate", duplicate));
    }

}
