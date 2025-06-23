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
    postId,
    title,
    nickname,
    profileImg,
    createdAt,
    tags,
    likeCount,
    commentCount,
    comments,
    viewCount,
    status,
  } = post;

  // commentCount가 없으면 comments 배열 길이로 계산
  const displayCommentCount =
    typeof commentCount === "number"
      ? commentCount
      : Array.isArray(comments)
      ? comments.length
      : 0;

  const isActiveStatus = (currentStatus) => {
    const activeKeywords = ["모집중", "매칭가능", "판매중"];
    return activeKeywords.includes(currentStatus);
  };

  return (
    <div
      className="card p-3 shadow-sm board-list-item"
      style={{ cursor: onClick ? "pointer" : "default" }}
      onClick={onClick ? () => onClick(postId) : undefined}
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
          <span className="author-name">{nickname}</span>
          <span className="mx-1">·</span>
          <span className="small">
            {createdAt ? new Date(createdAt).toLocaleDateString() : ""}
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
            <i className="bi bi-heart"></i> {likeCount || 0}
          </span>
          <span>
            <i className="bi bi-chat"></i> {displayCommentCount}
          </span>
          <span>
            <i className="bi bi-eye"></i> {viewCount || 0}
          </span>
        </span>
      </div>
    </div>
  );
};
