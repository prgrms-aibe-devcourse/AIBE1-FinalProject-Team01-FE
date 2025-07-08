import React from "react";
import { BoardTagShareBar } from "./BoardTagShareBar";
import CommentSection from "../comment/CommentSection";

/**
 * @typedef {Object} BoardDetailLayoutProps
 * @property {object} post - The post data object.
 * @property {React.ReactNode} children - The unique content for each board detail page.
 * @property {number} [likeCount]
 * @property {boolean} [isLiked]
 * @property {function} [onLike]
 * @property {number} [bookmarkCount]
 * @property {boolean} [isBookmarked]
 * @property {function} [onBookmark]
 */

/**
 * 게시글 상세 페이지 공통 레이아웃 (상태 없음)
 * @param {BoardDetailLayoutProps} props
 */
export const BoardDetailLayout = ({
  post,
  children,
  likeCount,
  isLiked,
  onLike,
  bookmarkCount,
  isBookmarked,
  onBookmark,

}) => {
    return (
        <div className="community-detail-container">
            {children}
            <BoardTagShareBar
                tags={post.tags}
                likes={likeCount}
                isLiked={isLiked}
                bookmarks={bookmarkCount}
                isBookmarked={isBookmarked}
                onLikeToggle={onLike}
                onBookmarkToggle={onBookmark}
                postId={post.postId}
            />
            <CommentSection
                boardType={post.boardType}
                boardPostId={post.communityId || post.id}
                postId={post.postId}
                comments={post.comments || []}
            />
        </div>
    );
};