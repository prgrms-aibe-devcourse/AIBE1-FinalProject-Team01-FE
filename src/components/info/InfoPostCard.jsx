import React from "react";
import "../../styles/components/board/Board.css";
import "../../styles/components/community/community.css";
import { DEVCOURSE_LABEL_COLORS } from "../../pages/info/constants";

/**
 * @typedef {Object} InfoPostCardProps
 * @property {object} post - The post object.
 * @property {string} categoryLabel - 카테고리 라벨(후기/뉴스)
 * @property {string} categoryKey - 카테고리 키(review/news)
 * @property {(id: number | string) => void} [onClick] - 카드 클릭 핸들러
 */

/**
 * IT 정보 게시판 전용 카드 컴포넌트
 * @param {InfoPostCardProps} props
 */
export default function InfoPostCard({
  post,
  categoryLabel,
  categoryKey,
  onClick,
}) {
  const {
    id,
    title,
    user,
    created_at,
    tags,
    like_count,
    comments,
    view_count,
  } = post;

  const commentCount = Array.isArray(comments)
    ? comments.length
    : comments || 0;

  return (
    <div
      className="card p-3 shadow-sm board-list-item"
      style={{ cursor: onClick ? "pointer" : "default" }}
      onClick={onClick ? () => onClick(id) : undefined}
    >
      <div className="d-flex align-items-center mb-2 gap-2">
        {categoryKey === "review" && user?.devcourse_name && (
          <span
            className="author-batch me-2"
            style={
              DEVCOURSE_LABEL_COLORS[user.devcourse_name] || {
                background: "#4F8FFF",
                color: "#fff",
              }
            }
          >
            {user.devcourse_name}
          </span>
        )}
        <span className="fw-bold fs-5 text-truncate flex-grow-1">{title}</span>
        <span className="ms-auto small text-nowrap">
          {new Date(created_at).toLocaleDateString()}
        </span>
      </div>
      <div className="d-flex align-items-center gap-2 mt-2">
        <span className="small tags-container">
          {tags?.map((tag, i) => (
            <span key={i} className="badge bg-light text-dark ms-1">
              #{tag}
            </span>
          ))}
        </span>
        <span className="ms-auto small d-flex align-items-center gap-3">
          <span>
            <i className="bi bi-heart"></i> {like_count || 0}
          </span>
          <span>
            <i className="bi bi-chat"></i> {commentCount}
          </span>
          <span>
            <i className="bi bi-eye"></i> {view_count || 0}
          </span>
        </span>
      </div>
    </div>
  );
}
