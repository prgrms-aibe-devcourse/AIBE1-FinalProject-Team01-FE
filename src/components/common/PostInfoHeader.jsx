import React from "react";
import { useAuth } from "../../context/AuthContext";
import { isAuthor } from "../../utils/auth";
import "../../styles/components/common/PostInfoHeader.css";

/**
 * @typedef {Object} PostInfoHeaderProps
 * @property {object} post - The post data object.
 * @property {() => void} onEdit - Function to handle edit action.
 * @property {() => void} onDelete - Function to handle delete action.
 * @property {boolean} [showStatus=true] - Whether to show the status badge.
 */

/**
 * 게시글 상단 정보 공통 컴포넌트
 * @param {PostInfoHeaderProps} props
 */
export const PostInfoHeader = ({
  post,
  onEdit,
  onDelete,
  showStatus = true,
}) => {
  const { user } = useAuth();
  const canEditOrDelete = isAuthor(user, post.authorId);

  const getStatusBadgeClass = () => {
    if (!post.status) return "d-none";
    if (["모집중", "판매중", "매칭가능"].includes(post.status)) {
      return "bg-dark"; // 진행중 상태
    }
    return "bg-secondary"; // 완료 상태
  };

  return (
    <div className="post-info-header">
      <div className="d-flex justify-content-between align-items-start">
        <div className="flex-grow-1">
          {showStatus && post.status && (
            <span className={`badge me-2 mb-2 ${getStatusBadgeClass()}`}>
              {post.status}
            </span>
          )}
          <h1 className="post-info-title mb-2">{post.title}</h1>
          <div className="d-flex align-items-center text-muted small">
            <span>{post.author}</span>
            <span className="mx-2">|</span>
            <span>{post.date}</span>
            <span className="ms-auto">조회 {post.views}</span>
          </div>
        </div>
        {canEditOrDelete && (
          <div className="post-info-actions flex-shrink-0 ms-3">
            <button onClick={onEdit}>수정</button>
            <button onClick={onDelete}>삭제</button>
          </div>
        )}
      </div>
      <hr />
    </div>
  );
};
