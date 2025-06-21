import React, { useState } from "react";
import CommunityTagShareBar from "../community/CommunityTagShareBar";
import CommunityCommentSection from "../community/CommunityCommentSection";

/**
 * @typedef {Object} BoardDetailLayoutProps
 * @property {object} post - The post data object.
 * @property {React.ReactNode} children - The unique content for each board detail page.
 */

/**
 * 게시글 상세 페이지 공통 레이아웃
 * @param {BoardDetailLayoutProps} props
 */
export const BoardDetailLayout = ({ post, children }) => {
  const [bookmarked, setBookmarked] = useState(post.bookmarked || false);
  const [bookmarkCount, setBookmarkCount] = useState(post.bookmarkCount || 0);

  const handleBookmarkClick = () => {
    setBookmarked((prev) => !prev);
    setBookmarkCount((prev) => prev + (bookmarked ? -1 : 1));
    // TODO: 백엔드에 북마크 토글 요청 보내기
  };

  return (
    <div className="community-detail-container">
      {children}
      <CommunityTagShareBar
        tags={post.tags}
        likes={post.likes}
        bookmarked={bookmarked}
        bookmarkCount={bookmarkCount}
        onBookmarkToggle={handleBookmarkClick}
      />
      <CommunityCommentSection postId={post.id} commentList={post.comments} />
    </div>
  );
};
