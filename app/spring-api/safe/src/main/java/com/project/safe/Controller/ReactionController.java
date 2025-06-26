package com.project.safe.Controller;

import com.project.safe.dto.ReactionDTO;
import com.project.safe.service.ReactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/reactions")
public class ReactionController {

    private final ReactionService reactionService;

    public ReactionController(ReactionService reactionService) {
        this.reactionService = reactionService;
    }

    @PostMapping
    public ResponseEntity<?> createOrUpdateReaction(@RequestBody ReactionDTO reactionDTO) {
        int userReaction = reactionService.saveReaction(reactionDTO); // 저장 후 현재 유저의 상태 반환

        int likeCount = reactionService.countReactionType(reactionDTO.getPostId(), 1);
        int dislikeCount = reactionService.countReactionType(reactionDTO.getPostId(), -1);

        return ResponseEntity.ok().body(Map.of(
                "likeCount", likeCount,
                "dislikeCount", dislikeCount,
                "userReaction", userReaction));
    }
}
