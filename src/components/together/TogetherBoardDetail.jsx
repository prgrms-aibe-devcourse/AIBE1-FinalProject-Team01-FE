import React from "react";
import { useNavigate } from "react-router-dom";
import { PostContent } from "../common/PostContent";
import { BoardDetailLayout } from "../board/BoardDetailLayout";
import { BoardPostHeader } from "../board/BoardPostHeader";
import { RECRUITMENT_TYPES } from "../../pages/together/constants";
import { TogetherPostInfo } from "./TogetherPostInfo";

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
export const TogetherBoardDetail = ({ post, onLike, onBookmark }) => {
  const navigate = useNavigate();
  const { gathering_post } = post;
  const isMatch =
    gathering_post?.gathering_type === "mentoring" ||
    gathering_post?.gathering_type === "coffeechat";
  const recruitmentTypeLabel =
    RECRUITMENT_TYPES[gathering_post?.recruitment_type];

  const handleEdit = () => {
    navigate(`/together/${post.board_type}/write`, {
      state: { postToEdit: post },
    });
  };

  const handleDelete = () => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      console.log("삭제할 게시글 ID:", post.id);
      alert("게시글이 삭제되었습니다.");
      navigate(`/together/${post.board_type}`);
    }
  };

  if (!gathering_post) {
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
