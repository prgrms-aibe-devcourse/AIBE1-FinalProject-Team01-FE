import { useState } from "react";

/**
 * 좋아요/북마크 상태 및 토글 로직을 제공하는 커스텀 훅
 * @param {object} options
 * @param {number} [options.initialLikeCount] - 초기 좋아요 수
 * @param {boolean} [options.initialLiked] - 초기 좋아요 여부
 * @param {number} [options.initialBookmarkCount] - 초기 북마크 수
 * @param {boolean} [options.initialBookmarked] - 초기 북마크 여부
 * @param {string | number} [options.postId] - 게시글 ID
 * @param {string} [options.boardType] - 게시판 타입 (COMMUNITY, GATHERING, MARKET 등)
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
  postId,
  boardType,
} = {}) {
  // 좋아요
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  // 북마크
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [bookmarkCount, setBookmarkCount] = useState(initialBookmarkCount);

  const toggleLike = async () => {
    try {
      // TODO: 백엔드 API 연동
      // liked가 true면 DELETE
      // liked가 false면 POST

      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? Math.max(0, prev - 1) : prev + 1));
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const toggleBookmark = async () => {
    try {
      // TODO: 백엔드 API 연동
      // bookmarked가 true면 DELETE
      // bookmarked가 false면 POST

      setBookmarked((prev) => !prev);
      setBookmarkCount((prev) =>
        bookmarked ? Math.max(0, prev - 1) : prev + 1
      );
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
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
