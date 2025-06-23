import React from "react";
import { useNavigate } from "react-router-dom";
import { PostContent } from "../common/PostContent";
import { BoardDetailLayout } from "../board/BoardDetailLayout";
import TogetherPostInfo from "./TogetherPostInfo";

/**
 * @typedef {Object} TogetherBoardDetailProps
 * @property {object} post
 * @property {() => void} [onLike]
 * @property {() => void} [onBookmark]
 */

/**
 * 함께해요 글 상세 메인 컴포넌트
 * @param {TogetherBoardDetailProps} props
 */
const TogetherBoardDetail = ({ post, onLike, onBookmark }) => {
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
    <BoardDetailLayout post={post} onLike={onLike} onBookmark={onBookmark}>
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
