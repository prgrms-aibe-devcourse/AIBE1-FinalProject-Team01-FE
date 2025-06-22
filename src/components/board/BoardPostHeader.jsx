import React from "react";
import { useAuth } from "../../context/AuthContext";
import { isAuthor } from "../../utils/auth";
import UserInfo from "../common/UserInfo";
import "../../styles/components/common/PostInfoHeader.css";

/**
 * @typedef {Object} BoardPostHeaderProps
 * @property {object} post - The post data object.
 * @property {string} [categoryLabel] - The label for the category to display.
 * @property {() => void} onEdit - Function to handle edit action.
 * @property {() => void} onDelete - Function to handle delete action.
 * @property {boolean} [showStatus=true] - Whether to show the status badge.
 */

/**
 * 게시글 상단 정보 공통 컴포넌트
 * @param {BoardPostHeaderProps} props
 */
export const BoardPostHeader = ({
  post,
  categoryLabel,
  onEdit,
  onDelete,
  showStatus = true,
}) => {
  const { user: currentUser } = useAuth();
  const canEditOrDelete = isAuthor(currentUser, post.user_id);

  const status = post.gathering_post?.status || post.market_item?.status;

  const getStatusBadgeClass = () => {
    if (!status) return "d-none";
    if (["모집중", "판매중", "매칭가능"].includes(status)) {
      return "bg-dark"; // 진행중 상태
    }
    return "bg-secondary"; // 완료 상태
  };

  return (
    <div className="post-info-header">
      {categoryLabel && <p className="post-category-label">{categoryLabel}</p>}
      <div className="d-flex justify-content-between align-items-start">
        <div className="flex-grow-1">
          {showStatus && status && (
            <span className={`badge me-2 mb-2 ${getStatusBadgeClass()}`}>
              {status}
            </span>
          )}
          <h1 className="post-info-title mb-3">{post.title}</h1>
          <div className="d-flex justify-content-between align-items-center">
            {post.category === "review" && post.user?.devcourse_name && (
              <span className="author-name">{post.user.devcourse_name}</span>
            )}
            {post.category === "news" && post.user?.nickname && (
              <span className="author-name">{post.user.nickname}</span>
            )}
            {post.category !== "review" && post.category !== "news" && (
              <UserInfo user={post.user} />
            )}
            <div className="d-flex align-items-center text-muted small">
              <span>{new Date(post.created_at).toLocaleString()}</span>
              <span className="mx-2">|</span>
              <span>조회 {post.view_count}</span>
            </div>
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
