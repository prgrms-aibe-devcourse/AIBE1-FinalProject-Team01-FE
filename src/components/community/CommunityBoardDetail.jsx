import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CommunityPostInfo from "./CommunityPostInfo";
import CommunityPostContent from "./CommunityPostContent";
import CommunityTagShareBar from "./CommunityTagShareBar";
import CommunityCommentSection from "./CommunityCommentSection";

/**
 * @typedef {Object} CommunityBoardDetailProps
 * @property {object} post
 */

/**
 * 커뮤니티 글 상세 메인 컴포넌트
 * @param {CommunityBoardDetailProps} props
 */
export default function CommunityBoardDetail({ post }) {
  const navigate = useNavigate();

  // 북마크 
  const [bookmarked, setBookmarked] = useState(post.bookmarked || false);
  const [bookmarkCount, setBookmarkCount] = useState(post.bookmarkCount || 0);
  const handleBookmarkClick = () => {
    setBookmarked((prev) => !prev);
    setBookmarkCount((prev) => prev + (bookmarked ? -1 : 1));
    // TODO: 백엔드에 북마크 토글 요청 보내기
  };

  const handleEdit = () => {
    console.log("수정할 게시글 데이터:", post);
    navigate(`/community/${post.category}/write`, {
      state: { postToEdit: post },
    });
  };

  const handleDelete = () => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      console.log("삭제할 게시글 ID:", post.id);
      // TODO: 실제 삭제 API 호출
      // await api.delete(`/community/posts/${post.id}`);
      alert("게시글이 삭제되었습니다.");
      navigate(`/community/${post.category}`);
    }
  };

  return (
    <div className="community-detail-container">
      <CommunityPostInfo
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
}
