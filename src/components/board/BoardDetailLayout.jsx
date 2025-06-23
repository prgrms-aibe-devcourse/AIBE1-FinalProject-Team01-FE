import React from "react";
import { BoardTagShareBar } from "./BoardTagShareBar";
import CommentSection from "../comment/CommentSection";

/**
 * @typedef {Object} BoardDetailLayoutProps
 * @property {object} post - The post data object.
 * @property {React.ReactNode} children - The unique content for each board detail page.
 * @property {() => void} [onLike] - Function to handle like action.
 * @property {() => void} [onBookmark] - Function to handle bookmark action.
 */

/**
 * 게시글 상세 페이지 공통 레이아웃 (상태 없음)
 * @param {BoardDetailLayoutProps} props
 */
export const BoardDetailLayout = ({ post, children, onLike, onBookmark }) => {
  return (
    <div className="community-detail-container">
      {children}

      <BoardTagShareBar
        tags={post.tags}
        likes={post.like_count}
        isLiked={post.is_liked}
        bookmarks={post.bookmark_count}
        isBookmarked={post.is_bookmarked}
        onLikeToggle={onLike}
        onBookmarkToggle={onBookmark}
      />

      <CommentSection postId={post.id} comments={post.comments || []} />
    </div>
  );
};
