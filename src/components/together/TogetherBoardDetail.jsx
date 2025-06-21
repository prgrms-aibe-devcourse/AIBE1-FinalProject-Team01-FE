import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TogetherPostInfo } from "./TogetherPostInfo";
import CommunityPostContent from "../community/CommunityPostContent";
import CommunityTagShareBar from "../community/CommunityTagShareBar";
import CommunityCommentSection from "../community/CommunityCommentSection";

/**
 * @typedef {Object} TogetherBoardDetailProps
 * @property {object} post
 */

/**
 * 함께해요 글 상세 메인 컴포넌트
 * @param {TogetherBoardDetailProps} props
 */
export const TogetherBoardDetail = ({ post }) => {
  const navigate = useNavigate();

  // 북마크 상태 관리
  const [bookmarked, setBookmarked] = useState(post.bookmarked || false);
  const [bookmarkCount, setBookmarkCount] = useState(post.bookmarkCount || 0);
  const handleBookmarkClick = () => {
    setBookmarked((prev) => !prev);
    setBookmarkCount((prev) => prev + (bookmarked ? -1 : 1));
    // TODO: 백엔드에 북마크 토글 요청
  };

  const handleEdit = () => {
    navigate(`/together/${post.category}/write`, {
      state: { postToEdit: post },
    });
  };

  const handleDelete = () => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      console.log("삭제할 게시글 ID:", post.id);
      // TODO: 실제 삭제 API 호출
      alert("게시글이 삭제되었습니다.");
      navigate(`/together/${post.category}`);
    }
  };

  return (
    <div className="community-detail-container">
      <TogetherPostInfo
        post={post}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <CommunityPostContent post={post} />
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
