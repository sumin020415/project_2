import React, { useState } from "react";
import axios from "axios";
import postStyle from "../pages/post.module.css"

const ReactionButtons = ({ postId, initialLike, initialDislike, initialUserReaction }) => {
    const [likeCount, setLikeCount] = useState(initialLike);
    const [dislikeCount, setDislikeCount] = useState(initialDislike);
    const [userReaction, setUserReaction] = useState(initialUserReaction);
    const token = localStorage.getItem("token");
    const userKey = localStorage.getItem("userKey");

    const toggleReaction = async (type) => {
        try {
            const res = await axios.post(
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

            const data = res.data;
            setLikeCount(data.likeCount);
            setDislikeCount(data.dislikeCount);
            setUserReaction(data.userReaction);

        } catch (error) {
            console.error("리액션 전송 실패:", error);
        }
    };

    return (
        <div className={postStyle.like_wrap} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => toggleReaction(1)} className={postStyle.like}>
                <svg width="18" height="18" viewBox="0 -1 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="m10.465 8.913-.067-.069a2.767 2.767 0 0 0 2.971-2.759V3.244A3.243 3.243 0 0 1 16.613 0h.47a3.714 3.714 0 0 1 3.714 3.714v5.199h6.746A4.456 4.456 0 0 1 31.954 14L30.44 24.608a5.94 5.94 0 0 1-5.883 5.102H7.427V8.913z" fill="url(#a)" /><path d="M0 11.884v14.855c0 1.64 1.33 2.971 2.971 2.971h7.428V8.913H2.97A2.97 2.97 0 0 0 0 11.884" fill="url(#b)" /><path d="M5.199 26.739a2.228 2.228 0 1 0 0-4.456 2.228 2.228 0 0 0 0 4.456" fill="#fff" /><defs><radialGradient id="a" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(11.88399 18.19742 -15.05062 9.82894 13.95 9.554)"><stop stopColor="#FADE6C" /><stop offset=".327" stopColor="#FED715" /><stop offset="1" stopColor="#FC9900" /></radialGradient><linearGradient id="b" x1="5.199" y1="8.913" x2="5.199" y2="29.71" gradientUnits="userSpaceOnUse"><stop stopColor="#9D65F5" /><stop offset="1" stopColor="#6025CE" /></linearGradient></defs></svg> {likeCount}
            </button>
            <button onClick={() => toggleReaction(-1)} className={postStyle.like}>
                <svg className={postStyle.hate} width="18" height="18" viewBox="0 -1 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="m10.465 8.913-.067-.069a2.767 2.767 0 0 0 2.971-2.759V3.244A3.243 3.243 0 0 1 16.613 0h.47a3.714 3.714 0 0 1 3.714 3.714v5.199h6.746A4.456 4.456 0 0 1 31.954 14L30.44 24.608a5.94 5.94 0 0 1-5.883 5.102H7.427V8.913z" fill="url(#a)" /><path d="M0 11.884v14.855c0 1.64 1.33 2.971 2.971 2.971h7.428V8.913H2.97A2.97 2.97 0 0 0 0 11.884" fill="url(#b)" /><path d="M5.199 26.739a2.228 2.228 0 1 0 0-4.456 2.228 2.228 0 0 0 0 4.456" fill="#fff" /><defs><radialGradient id="a" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(11.88399 18.19742 -15.05062 9.82894 13.95 9.554)"><stop stopColor="#FADE6C" /><stop offset=".327" stopColor="#FED715" /><stop offset="1" stopColor="#FC9900" /></radialGradient><linearGradient id="b" x1="5.199" y1="8.913" x2="5.199" y2="29.71" gradientUnits="userSpaceOnUse"><stop stopColor="#9D65F5" /><stop offset="1" stopColor="#6025CE" /></linearGradient></defs></svg> {dislikeCount}
            </button>
        </div>
    );
};

export default ReactionButtons;
