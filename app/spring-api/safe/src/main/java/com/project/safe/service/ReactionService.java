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

    public void saveReaction(ReactionDTO dto) {
        Optional<Reaction> existing = reactionRepository.findByPostIdAndUserKey(dto.getPostId(), dto.getUserKey());

        if (existing.isPresent()) {
            Reaction reaction = existing.get();

            if (reaction.getReactionType() == dto.getReactionType()) {
                // 같은 리액션 다시 누르면 → 취소
                reactionRepository.delete(reaction);
            } else {
                // 다른 리액션으로 바꾸면 → 수정
                reaction.setReactionType(dto.getReactionType());
                reactionRepository.save(reaction);
            }

        } else {
            // 처음 누른 경우 → 새로 저장
            Reaction reaction = new Reaction();
            reaction.setPostId(dto.getPostId());
            reaction.setUserKey(dto.getUserKey());
            reaction.setReactionType(dto.getReactionType());
            // ID, createdAt은 @PrePersist로 자동 생성됨

            reactionRepository.save(reaction);
        }
    }
}
