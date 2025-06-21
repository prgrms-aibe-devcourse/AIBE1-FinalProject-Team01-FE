import React from "react";
import { useNavigate } from "react-router-dom";
import { TogetherPostInfo } from "./TogetherPostInfo";
import CommunityPostContent from "../community/CommunityPostContent";
import { BoardDetailLayout } from "../common/BoardDetailLayout";

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

  const handleEdit = () => {
    navigate(`/together/${post.category}/write`, {
      state: { postToEdit: post },
    });
  };

  const handleDelete = () => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      console.log("삭제할 게시글 ID:", post.id);
      alert("게시글이 삭제되었습니다.");
      navigate(`/together/${post.category}`);
    }
  };

  return (
    <BoardDetailLayout post={post}>
      <TogetherPostInfo
        post={post}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <CommunityPostContent post={post} />
    </BoardDetailLayout>
  );
};
