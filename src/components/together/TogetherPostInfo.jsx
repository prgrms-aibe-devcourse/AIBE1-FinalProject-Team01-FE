import React from "react";
import "../../styles/components/community/community.css";
import "../../styles/components/together/together.css";
import { useAuth } from "../../context/AuthContext";
import { isAuthor } from "../../utils/auth";
import { BoardPostHeader } from "../board/BoardPostHeader";
import {
  RECRUITMENT_TYPES,
  TOGETHER_CATEGORIES,
} from "../../pages/together/constants";

/**
 * @typedef {Object} TogetherPostInfoProps
 * @property {object} post - The post data object.
 * @property {() => void} onEdit - Function to handle edit action.
 * @property {() => void} onDelete - Function to handle delete action.
 */

/**
 * 함께해요 게시글 상단 정보 (고유 정보 포함)
 * @param {TogetherPostInfoProps} props
 */
export const TogetherPostInfo = ({ post, onEdit, onDelete }) => {
  const { user: currentUser } = useAuth();
  const canEditOrDelete = isAuthor(currentUser, post.user_id);
  const { gathering_post } = post;

  const isMatch =
    gathering_post?.gathering_type === "mentoring" ||
    gathering_post?.gathering_type === "coffeechat";
  const recruitmentTypeLabel =
    RECRUITMENT_TYPES[gathering_post?.recruitment_type];

  if (!gathering_post) {
    return <div>게시글 정보를 불러오는 중입니다...</div>;
  }

  return (
    <>
      <BoardPostHeader
        post={post}
        onEdit={onEdit}
        onDelete={onDelete}
        categoryLabel={TOGETHER_CATEGORIES[gathering_post.gathering_type]}
      />
      <div className="d-flex flex-wrap justify-content-around align-items-center p-3 my-4 rounded bg-light">
        <div className="text-center mx-2 my-2">
          <h6 className="text-muted mb-1">모집인원</h6>
          <p className="m-0 fw-bold">
            <i className="bi bi-people-fill me-1"></i>
            {gathering_post.headCount}명
          </p>
        </div>

        {isMatch ? (
          <div className="text-center mx-2 my-2">
            <h6 className="text-muted mb-1">모집 분야</h6>
            <p className="m-0 fw-bold">{recruitmentTypeLabel}</p>
          </div>
        ) : (
          <div className="text-center mx-2 my-2">
            <h6 className="text-muted mb-1">기간</h6>
            <p className="m-0 fw-bold">
              <i className="bi bi-calendar-check me-1"></i>
              {gathering_post.period}
            </p>
          </div>
        )}

        <div className="text-center mx-2 my-2">
          <h6 className="text-muted mb-1">장소</h6>
          <p className="m-0 fw-bold">
            <i className="bi bi-geo-alt me-1"></i>
            {gathering_post.place}
          </p>
        </div>
      </div>
    </>
  );
};
