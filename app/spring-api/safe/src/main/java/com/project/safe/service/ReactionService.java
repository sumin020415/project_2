package com.project.safe.service;

import com.project.safe.domain.Reaction;
import com.project.safe.dto.ReactionDTO;
import com.project.safe.repository.ReactionRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ReactionService {

    private final ReactionRepository reactionRepository;

    public ReactionService(ReactionRepository reactionRepository) {
        this.reactionRepository = reactionRepository;
    }

    /**
     * 리액션 저장 또는 취소 후, 최종 유저 상태 (1: 좋아요, -1: 싫어요, 0: 없음) 반환
     */
    public int saveReaction(ReactionDTO dto) {
        Optional<Reaction> existing = reactionRepository.findByPostIdAndUserKey(dto.getPostId(), dto.getUserKey());

        if (existing.isPresent()) {
            Reaction reaction = existing.get();

            if (reaction.getReactionType() == dto.getReactionType()) {
                // 같은 리액션 다시 누르면 → 취소
                reactionRepository.delete(reaction);
                return 0; // userReaction 없음
            } else {
                // 다른 리액션으로 바꾸면 → 수정
                reaction.setReactionType(dto.getReactionType());
                reactionRepository.save(reaction);
                return dto.getReactionType();
            }

        } else {
            // 처음 누른 경우 → 새로 저장
            Reaction reaction = new Reaction();
            reaction.setPostId(dto.getPostId());
            reaction.setUserKey(dto.getUserKey());
            reaction.setReactionType(dto.getReactionType());
            reactionRepository.save(reaction);
            return dto.getReactionType();
        }
    }

    public int countReactionType(String postId, int reactionType) {
        return reactionRepository.countByPostIdAndReactionType(postId, reactionType).intValue();
    }
}