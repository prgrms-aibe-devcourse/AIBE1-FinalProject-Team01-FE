import React from "react";
import { useNavigate } from "react-router-dom";
import { BoardPostHeader } from "../board/BoardPostHeader";
import { PostContent } from "../common/PostContent";
import { BoardDetailLayout } from "../board/BoardDetailLayout";
import { CATEGORY_MAP } from "../../pages/community/constants";

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

  const handleEdit = () => {
    navigate(`/community/${post.category}/write`, {
      state: { postToEdit: post },
    });
  };

  const handleDelete = () => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      console.log("삭제할 게시글 ID:", post.id);
      alert("게시글이 삭제되었습니다.");
      navigate(`/community/${post.category}`);
    }
  };

  return (
    <BoardDetailLayout post={post}>
      <BoardPostHeader
        post={post}
        categoryLabel={CATEGORY_MAP[post.category]}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showStatus={false}
      />
      <PostContent post={post} />
    </BoardDetailLayout>
  );
}
