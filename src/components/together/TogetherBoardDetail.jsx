import React from "react";
import { useNavigate } from "react-router-dom";
import { PostContent } from "../common/PostContent";
import TogetherPostInfo from "./TogetherPostInfo";
import { BoardDetailLayout } from "../board/BoardDetailLayout";

/**
 * @typedef {Object} TogetherBoardDetailProps
 * @property {object} post
 * @property {boolean} [liked]
 * @property {number} [likeCount]
 * @property {function} [onLike]
 * @property {boolean} [bookmarked]
 * @property {number} [bookmarkCount]
 * @property {function} [onBookmark]
 */

/**
 * 함께해요 글 상세 메인 컴포넌트
 * @param {TogetherBoardDetailProps} props
 */
const TogetherBoardDetail = ({
  post,
  liked,
  likeCount,
  onLike,
  bookmarked,
  bookmarkCount,
  onBookmark,
}) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/together/${post.boardType.toLowerCase()}/write`, {
      state: { postToEdit: post },
    });
  };

  const handleDelete = () => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      console.log("삭제할 게시글 ID:", post.postId);
      alert("게시글이 삭제되었습니다.");
      navigate(`/together/${post.boardType.toLowerCase()}`);
    }
  };

  if (!post) {
    return <div>게시글 정보를 불러오는 중입니다...</div>;
  }

  return (
    <BoardDetailLayout
      post={post}
      likeCount={likeCount}
      isLiked={liked}
      onLike={onLike}
      bookmarkCount={bookmarkCount}
      isBookmarked={bookmarked}
      onBookmark={onBookmark}
      boardTitle="함께해요"
      boardLink="/together"
    >
      <TogetherPostInfo
        post={post}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <PostContent post={post} />
    </BoardDetailLayout>
  );
};

export default TogetherBoardDetail;
