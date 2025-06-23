import React, { useState } from "react";
import axios from "axios";

const ReactionButtons = ({ postId, initialLike, initialDislike, initialUserReaction }) => {
    const [likeCount, setLikeCount] = useState(initialLike);
    const [dislikeCount, setDislikeCount] = useState(initialDislike);
    const [userReaction, setUserReaction] = useState(initialUserReaction);
    const token = localStorage.getItem("token");
    const userKey = localStorage.getItem("userKey");

    const toggleReaction = async (type) => {
        try {
            await axios.post(
                "/api/reactions",
                {
                    postId: postId,
                    userKey: userKey,
                    reactionType: type,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            if (userReaction === type) {
                // 같은 리액션이면 취소
                if (type === 1) setLikeCount(likeCount - 1);
                if (type === -1) setDislikeCount(dislikeCount - 1);
                setUserReaction(0);
            } else {
                // 다른 리액션이면 수정
                if (type === 1) {
                    setLikeCount(likeCount + 1);
                    if (userReaction === -1) setDislikeCount(dislikeCount - 1);
                } else {
                    setDislikeCount(dislikeCount + 1);
                    if (userReaction === 1) setLikeCount(likeCount - 1);
                }
                setUserReaction(type);
            }
        } catch (error) {
            console.error("리액션 전송 실패:", error);
        }
    };

    return (
        <div>
            <button
                onClick={() => toggleReaction(1)}
                style={{ color: userReaction === 1 ? "blue" : "black", marginRight: "8px" }}
            >
                👍 {likeCount}
            </button>
            <button
                onClick={() => toggleReaction(-1)}
                style={{ color: userReaction === -1 ? "red" : "black" }}
            >
                👎 {dislikeCount}
            </button>
        </div>
    );
};

export default ReactionButtons;
