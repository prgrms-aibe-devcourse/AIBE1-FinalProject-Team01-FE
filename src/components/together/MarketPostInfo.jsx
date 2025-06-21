import React from "react";
import { useAuth } from "../../context/AuthContext";
import { isAuthor } from "../../utils/auth";
import "../../styles/components/community/community.css";

/**
 * @typedef {Object} MarketPostInfoProps
 * @property {object} post - The post data object.
 * @property {() => void} onEdit - Function to handle edit action.
 * @property {() => void} onDelete - Function to handle delete action.
 */

/**
 * 장터 게시글 상단 정보 컴포넌트
 * @param {MarketPostInfoProps} props
 */
export const MarketPostInfo = ({ post, onEdit, onDelete }) => {
  const { user } = useAuth();
  const canEditOrDelete = isAuthor(user, post.authorId);

  return (
    <div className="community-detail-info">
      <div className="d-flex justify-content-between align-items-start">
        <div className="flex-grow-1">
          <span
            className={`badge me-2 mb-2 ${
              post.status === "판매중" ? "bg-dark" : "bg-secondary"
            }`}
          >
            {post.status}
          </span>
          <h1 className="community-detail-title mb-2">{post.title}</h1>
          <div className="d-flex align-items-center text-muted small">
            <span>{post.author}</span>
            <span className="mx-2">|</span>
            <span>{post.date}</span>
            <span className="ms-auto">조회 {post.views}</span>
          </div>
        </div>
        {canEditOrDelete && (
          <div className="community-detail-actions flex-shrink-0 ms-3">
            <button onClick={onEdit}>수정</button>
            <button onClick={onDelete}>삭제</button>
          </div>
        )}
      </div>

      <hr />

      <div className="d-flex align-items-center gap-5 mt-4">
        <div>
          <h6 className="text-muted mb-1">가격</h6>
          <h4 className="fw-bold m-0">{post.price?.toLocaleString()}원</h4>
        </div>
        <div>
          <h6 className="text-muted mb-1">거래 장소</h6>
          <p className="m-0">
            <i className="bi bi-geo-alt me-1"></i>
            {post.location || "온라인/직거래"}
          </p>
        </div>
      </div>
    </div>
  );
};
