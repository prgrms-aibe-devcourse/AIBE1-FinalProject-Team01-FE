import { useState } from "react";

/**
 * 좋아요/북마크 상태 및 토글 로직을 제공하는 커스텀 훅
 * @param {object} options
 * @param {number} [options.initialLikeCount] - 초기 좋아요 수
 * @param {boolean} [options.initialLiked] - 초기 좋아요 여부
 * @param {number} [options.initialBookmarkCount] - 초기 북마크 수
 * @param {boolean} [options.initialBookmarked] - 초기 북마크 여부
 * @returns {{
 *   liked: boolean,
 *   likeCount: number,
 *   toggleLike: function,
 *   bookmarked: boolean,
 *   bookmarkCount: number,
 *   toggleBookmark: function
 * }}
 */
export function useLikeBookmark({
  initialLikeCount = 0,
  initialLiked = false,
  initialBookmarkCount = 0,
  initialBookmarked = false,
} = {}) {
  // 좋아요
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  // 북마크
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [bookmarkCount, setBookmarkCount] = useState(initialBookmarkCount);

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    // TODO: 백엔드에 좋아요/취소 요청 보내기
  };

  const toggleBookmark = () => {
    setBookmarked((prev) => !prev);
    setBookmarkCount((prev) => (bookmarked ? prev - 1 : prev + 1));
    // TODO: 백엔드에 북마크/취소 요청 보내기
  };

  return {
    liked,
    likeCount,
    toggleLike,
    bookmarked,
    bookmarkCount,
    toggleBookmark,
  };
}
