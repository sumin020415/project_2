package com.project.safe.service;

import com.project.safe.domain.Member;
import com.project.safe.dto.UserDTO;
import com.project.safe.repository.MemberRepository;

import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public MemberService(MemberRepository memberRepository, PasswordEncoder passwordEncoder) {
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void register(UserDTO dto) {
        if (memberRepository.existsByUserId(dto.getUserId())) {
            throw new RuntimeException("이미 존재하는 아이디입니다.");
        }

        Member member = new Member();

        member.setUserKey(UUID.randomUUID().toString().replace("-", "").toUpperCase());

        member.setUserId(dto.getUserId());
        member.setUserPw(passwordEncoder.encode(dto.getUserPw()));
        member.setNickname(dto.getNickname());
        member.setUserEmail(dto.getUserEmail());

        memberRepository.save(member);
    }

    public void resetPassword(String userId, String newPassword) {
        Member member = memberRepository.findByUserId(userId);
        if (member == null) {
            throw new IllegalArgumentException("존재하지 않는 사용자입니다.");
        }

        member.setUserPw(passwordEncoder.encode(newPassword)); // 재암호화
        memberRepository.save(member);
    }
}
