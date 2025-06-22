import React from "react";
import "../../styles/components/board/Board.css";

/**
 * @typedef {Object} PostCardProps
 * @property {object} post - The post object.
 * @property {string} categoryLabel - The display label for the category (e.g., 'Q&A', '스터디').
 * @property {string} categoryKey - The key for the category (e.g., 'qna', 'study').
 * @property {(id: number | string) => void} [onClick] - Click handler for the card.
 * @property {React.ReactNode} [children] - Additional content specific to the board type.
 */

/**
 * 게시글 목록에 사용되는 공통 카드 레이아웃
 * @param {PostCardProps} props
 */
export const PostCard = ({
  post,
  categoryLabel,
  categoryKey,
  onClick,
  children,
}) => {
  const {
    id,
    title,
    user,
    created_at,
    tags,
    like_count,
    comments,
    view_count,
    gathering_post,
    market_item,
  } = post;

  const status = gathering_post?.status || market_item?.status;

  const commentCount = Array.isArray(comments)
    ? comments.length
    : comments || 0;

  const isActiveStatus = (currentStatus) => {
    const activeKeywords = ["모집중", "매칭가능", "판매중"];
    return activeKeywords.includes(currentStatus);
  };

  return (
    <div
      className="card p-3 shadow-sm board-list-item"
      style={{ cursor: onClick ? "pointer" : "default" }}
      onClick={onClick ? () => onClick(id) : undefined}
    >
      <div className="d-flex align-items-center mb-2 gap-2">
        <span className={`community-category-label me-1 label-${categoryKey}`}>
          {categoryLabel}
        </span>
        {status && (
          <span
            className={`community-category-label me-2 ${
              isActiveStatus(status)
                ? "bg-success text-white"
                : "bg-secondary text-white"
            }`}
          >
            {status}
          </span>
        )}
        <span className="fw-bold fs-5 text-truncate">{title}</span>
        <div className="author-info ms-auto text-nowrap">
          <span className="author-name">{user?.nickname}</span>
          {user?.devcourse_name && (
            <span className="author-batch ms-2">{user.devcourse_name}</span>
          )}
          <span className="mx-1">·</span>
          <span className="small">
            {new Date(created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
      {children}
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
};
