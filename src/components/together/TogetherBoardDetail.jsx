import React from "react";
import { useNavigate } from "react-router-dom";
import { PostContent } from "../common/PostContent";
import { BoardDetailLayout } from "../board/BoardDetailLayout";
import { BoardPostHeader } from "../board/BoardPostHeader";

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
  const { gathering_post } = post;

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
    <BoardDetailLayout post={post}>
      <BoardPostHeader
        post={post}
        onEdit={handleEdit}
        onDelete={handleDelete}
        categoryLabel={gathering_post.gathering_type}
      />
      <div className="d-flex flex-wrap justify-content-around align-items-center p-3 my-4 rounded bg-light">
        <div className="text-center mx-2 my-2">
          <h6 className="text-muted mb-1">모집인원</h6>
          <p className="m-0 fw-bold">
            <i className="bi bi-people-fill me-1"></i>
            {gathering_post.headCount}명
          </p>
        </div>
        <div className="text-center mx-2 my-2">
          <h6 className="text-muted mb-1">기간</h6>
          <p className="m-0 fw-bold">
            <i className="bi bi-calendar-check me-1"></i>
            {gathering_post.period}
          </p>
        </div>
        <div className="text-center mx-2 my-2">
          <h6 className="text-muted mb-1">장소</h6>
          <p className="m-0 fw-bold">
            <i className="bi bi-geo-alt me-1"></i>
            {gathering_post.place}
          </p>
        </div>
      </div>
      <PostContent post={post} />
    </BoardDetailLayout>
  );
};
