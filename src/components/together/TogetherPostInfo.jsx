import React from "react";
import "../../styles/components/community/community.css";
import "../../styles/components/together/together.css";
import { useAuth } from "../../context/AuthContext";
import { isAuthor } from "../../utils/auth";
import { PostInfoHeader } from "../common/PostInfoHeader";
import { Link } from "react-router-dom";
import { categoryLabelToSlug } from "../../pages/together/constants";

/**
 * @typedef {Object} Post
 * @property {string} categoryLabel
 * @property {string} status
 * @property {string} title
 * @property {string} period
 * @property {string} timeText
 * @property {string} location
 * @property {number} recruitCount
 * @property {string} authorId
 */

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
  const { user } = useAuth();
  const canEditOrDelete = isAuthor(user, post.authorId);
  const isRecruiting = post.status === "모집중" || post.status === "매칭가능";

  return (
    <>
      <PostInfoHeader
        post={post}
        onEdit={onEdit}
        onDelete={onDelete}
        categoryLabel={post.categoryLabel}
      />
      <div className="d-flex flex-wrap justify-content-around align-items-center p-3 rounded bg-light">
        <div className="text-center mx-2 my-2">
          <h6 className="text-muted mb-1">모집인원</h6>
          <p className="m-0 fw-bold">
            <i className="bi bi-people-fill me-1"></i>
            {post.recruitCount}명
          </p>
        </div>
        <div className="text-center mx-2 my-2">
          <h6 className="text-muted mb-1">기간</h6>
          <p className="m-0 fw-bold">
            <i className="bi bi-calendar-check me-1"></i>
            {post.period}
          </p>
        </div>
        <div className="text-center mx-2 my-2">
          <h6 className="text-muted mb-1">시간</h6>
          <p className="m-0 fw-bold">
            <i className="bi bi-clock me-1"></i>
            {post.timeText}
          </p>
        </div>
        <div className="text-center mx-2 my-2">
          <h6 className="text-muted mb-1">장소</h6>
          <p className="m-0 fw-bold">
            <i className="bi bi-geo-alt me-1"></i>
            {post.location}
          </p>
        </div>
      </div>
    </>
  );
};
