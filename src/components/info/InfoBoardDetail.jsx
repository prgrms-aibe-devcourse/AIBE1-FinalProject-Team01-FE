import "../../styles/components/board/Board.css";
import "../../styles/components/community/community.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import { BoardDetailLayout } from "../board/BoardDetailLayout";
import { BoardPostHeader } from "../board/BoardPostHeader";
import { PostContent } from "../common/PostContent";
import { INFO_CATEGORY_LABELS } from "../../pages/info/constants";

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
    navigate(`/info/review/write`, { state: { postToEdit: post } });
  };
  const handleDelete = () => {
    if (onDelete) return onDelete();
    if (window.confirm("정말로 이 후기를 삭제하시겠습니까?")) {
      alert("후기가 삭제되었습니다.");
      navigate(`/info/review`);
    }
  };

  return (
    <BoardDetailLayout post={post} onLike={onLike} onBookmark={onBookmark}>
      <BoardPostHeader
        post={post}
        categoryLabel={INFO_CATEGORY_LABELS[post.category]}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showStatus={false}
      />
      <PostContent post={post} />
    </BoardDetailLayout>
  );
}
