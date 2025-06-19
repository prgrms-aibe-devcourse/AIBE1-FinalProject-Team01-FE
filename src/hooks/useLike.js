import { useState } from "react";

/**
 * 좋아요 상태 및 토글 로직을 제공하는 커스텀 훅
 * @param {number} initialLikes - 초기 좋아요 수
 * @param {boolean} initialLiked - 초기 좋아요 여부
 * @returns {{ liked: boolean, likeCount: number, toggleLike: function }}
 */
export function useLike(initialLikes = 0, initialLiked = false) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikes);

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    // TODO: 백엔드에 좋아요/취소 요청 보내기
  };

  return { liked, likeCount, toggleLike };
}
