import { useState, useEffect } from "react";
import { addBookmark, removeBookmark } from "../services/bookmarkApi";
import { addLikePost, removeLikePost, addLikeComment, removeLikeComment } from "../services/likeApi";


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
  commentId,
} = {}) {
  // 좋아요
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  // 북마크
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [bookmarkCount, setBookmarkCount] = useState(initialBookmarkCount);

  useEffect(() => {
    setLiked(initialLiked);
    setLikeCount(initialLikeCount);
    setBookmarked(initialBookmarked);
    setBookmarkCount(initialBookmarkCount);
  }, [initialLiked, initialLikeCount, initialBookmarked, initialBookmarkCount]);

  const toggleLike = async () => {
    try {
      if (liked) {
        await removeLikePost(postId);
      } else {
        await addLikePost(postId);
      }

      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? Math.max(0, prev - 1) : prev + 1));
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const toggleLikeComment = async () => {
    try {
      if (liked) {
        await removeLikeComment(postId, commentId);
      } else {
        await addLikeComment(postId, commentId);
      }

      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? Math.max(0, prev - 1) : prev + 1));
    } catch (error) {
      console.error("Error toggling like on comment:", error);
    }
  };


  // 유저 아이디 하드코딩되어있음 나중에 수정 필요 
  const toggleBookmark = async () => {
    try {
      if (bookmarked) {
        await removeBookmark(23, postId);
      } else {
        await addBookmark(23, postId);
      }

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
    toggleLikeComment,
    bookmarked,
    bookmarkCount,
    toggleBookmark,
  };
}
