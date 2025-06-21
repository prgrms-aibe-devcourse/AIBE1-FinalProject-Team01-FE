import React from "react";
import "../../styles/components/community/community.css";
import "../../styles/together/together.css";

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
 * 함께해요 게시글 상단 정보 컴포넌트
 * @param {TogetherPostInfoProps} props
 */
export const TogetherPostInfo = ({ post, onEdit, onDelete }) => {
  const isRecruiting = post.status === "모집중" || post.status === "매칭가능";

  return (
    <div className="community-detail-info">
      <div className="community-detail-title-row">
        <div>
          <span
            className={`community-category-label me-1 label-${
              categoryLabelToSlug[post.categoryLabel] || "default"
            }`}
          >
            {post.categoryLabel}
          </span>
          {post.status && (
            <span
              className={`community-category-label me-2 ${
                isRecruiting ? "bg-success" : "bg-secondary text-white"
              }`}
            >
              {post.status}
            </span>
          )}
        </div>
        <div className="community-detail-actions">
          <button onClick={onEdit}>수정</button>
          <button onClick={onDelete}>삭제</button>
        </div>
      </div>

      <h1 className="community-detail-title">{post.title}</h1>

      <div className="community-detail-meta mt-3">
        <img
          src={post.authorProfileImg}
          alt={post.author}
          className="author-img"
        />
        <span className="author-name">{post.author}</span>
        {post.devcourseName && (
          <span className="author-batch">{post.devcourseName}</span>
        )}
        <span className="mx-2">|</span>
        <span className="text-muted">{post.date}</span>
        <span className="ms-auto text-muted">조회 {post.views}</span>
      </div>

      {/* 추가 정보 그리드 */}
      <div className="row mt-4 mb-2 p-3 bg-light rounded">
        {post.recruitCount != null && (
          <div className="col-md-3">
            <i className="bi bi-people me-2"></i>
            <strong>모집인원:</strong> {post.recruitCount}명
          </div>
        )}
        {post.location && (
          <div className="col-md-3">
            <i className="bi bi-geo-alt me-2"></i>
            <strong>장소:</strong> {post.location}
          </div>
        )}
        {post.timeText && (
          <div className="col-md-3">
            <i className="bi bi-calendar-check me-2"></i>
            <strong>시간:</strong> {post.timeText}
          </div>
        )}
        {post.period && (
          <div className="col-md-3">
            <i className="bi bi-calendar-range me-2"></i>
            <strong>기간:</strong> {post.period}
          </div>
        )}
      </div>
    </div>
  );
};
