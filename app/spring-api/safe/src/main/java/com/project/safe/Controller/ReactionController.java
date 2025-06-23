package com.project.safe.Controller;

import com.project.safe.dto.ReactionDTO;
import com.project.safe.service.ReactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reactions")
public class ReactionController {

    private final ReactionService reactionService;

    public ReactionController(ReactionService reactionService) {
        this.reactionService = reactionService;
    }

    @PostMapping
    public ResponseEntity<?> createOrUpdateReaction(@RequestBody ReactionDTO reactionDTO) {
        reactionService.saveReaction(reactionDTO);
        return ResponseEntity.ok().body("리액션 등록 완료");
    }
}
