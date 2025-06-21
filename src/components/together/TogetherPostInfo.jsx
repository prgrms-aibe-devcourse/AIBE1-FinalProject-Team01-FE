import React from "react";
import "../../styles/components/community/community.css";
import "../../styles/together/together.css";
import { useAuth } from "../../context/AuthContext";
import { isAuthor } from "../../utils/auth";
import { PostInfoHeader } from "../common/PostInfoHeader";

const categoryLabelToSlug = {
  스터디: "study",
  프로젝트: "project",
  해커톤: "hackathon",
  커피챗: "coffeechat",
  멘토링: "mentoring",
  중고거래: "market",
};

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
      <PostInfoHeader post={post} onEdit={onEdit} onDelete={onDelete} />
      <div className="py-4">
        <p>
          <i className="bi bi-people-fill me-2"></i>
          <strong>모집인원:</strong> {post.recruitCount}명
        </p>
        <p>
          <i className="bi bi-calendar-check me-2"></i>
          <strong>기간:</strong> {post.period}
        </p>
        <p>
          <i className="bi bi-clock me-2"></i>
          <strong>시간:</strong> {post.timeText}
        </p>
        <p className="mb-0">
          <i className="bi bi-geo-alt me-2"></i>
          <strong>장소:</strong> {post.location}
        </p>
      </div>
      <hr className="mt-0" />
    </>
  );
};
