import "../../styles/components/board/Board.css";
import "../../styles/components/community/community.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import { BoardDetailLayout } from "../board/BoardDetailLayout";
import { BoardPostHeader } from "../board/BoardPostHeader";
import { PostContent } from "../common/PostContent";

export default function InfoBoardDetail({
  post,
  onEdit,
  onDelete,
  onLike,
  onBookmark,
}) {
  const navigate = useNavigate();

  const handleEdit = () => {
    if (onEdit) return onEdit();
    navigate(`/info/REVIEW/write`, { state: { postToEdit: post } });
  };
  const handleDelete = () => {
    if (onDelete) return onDelete();
    if (window.confirm("정말로 이 후기를 삭제하시겠습니까?")) {
      alert("후기가 삭제되었습니다.");
      navigate(`/info/REVIEW`);
    }
  };

  return (
    <BoardDetailLayout
      post={post}
      likeCount={post.likeCount}
      isLiked={post.isLiked}
      bookmarkCount={post.bookmarkCount}
      isBookmarked={post.isBookmarked}
      onLike={onLike}
      onBookmark={onBookmark}
    >
      <BoardPostHeader
        post={{
          ...post,
          nickname: undefined,
        }}
        devcourseName={post.devcourseName}
        devcourseBatch={post.devcourseBatch}
        boardType={post.boardType?.toUpperCase?.() || "REVIEW"}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <PostContent post={post} />
    </BoardDetailLayout>
  );
}
