import React from "react";
import { useNavigate } from "react-router-dom";
import { BoardDetailLayout } from "../board/BoardDetailLayout";
import { BoardPostHeader } from "../board/BoardPostHeader";
import { PostContent } from "../common/PostContent";
import { CATEGORY_MAP } from "../../pages/community/constants";
import "../../styles/components/community/community.css";

/**
 * @typedef {Object} CommunityBoardDetailProps
 * @property {object} post
 * @property {function} onLike
 * @property {function} onBookmark
 */

export default function CommunityBoardDetail({ post, onLike, onBookmark }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/community/write`, { state: { postToEdit: post } });
  };

  const handleDelete = () => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      console.log("삭제할 게시글 ID:", post.id);
      alert("게시글이 삭제되었습니다.");
      navigate(`/community/${post.category}`);
    }
  };

  return (
    <BoardDetailLayout post={post} onLike={onLike} onBookmark={onBookmark}>
      <BoardPostHeader
        post={post}
        onEdit={handleEdit}
        onDelete={handleDelete}
        categoryLabel={CATEGORY_MAP[post.category]}
      />
      <PostContent post={post} />
    </BoardDetailLayout>
  );
}
