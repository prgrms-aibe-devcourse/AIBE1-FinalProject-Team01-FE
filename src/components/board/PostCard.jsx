import React from "react";
import "../../styles/components/board/Board.css";
import UserInfo from "../common/UserInfo";
import {
  GATHERING_STATUS_LABELS,
  MATCH_STATUS_LABELS,
  MARKET_STATUS_LABELS,
  STATUS_LABELS,
  STATUS_COLOR_MAP,
} from "../../pages/together/constants";

/**
 * @typedef {Object} PostCardProps
 * @property {object} post - The post object.
 * @property {string} categoryLabel - The display label for the category (e.g., 'Q&A', '스터디').
 * @property {string} categoryKey - The key for the category (e.g., 'qna', 'study').
 * @property {(id: number | string) => void} [onClick] - Click handler for the card.
 * @property {React.ReactNode} [children] - Additional content specific to the board type.
 */

function getStatusLabelAndColor(status) {
  const label = STATUS_LABELS[status] || status;
  const colorClass = STATUS_COLOR_MAP[label] || "bg-secondary text-white";
  return { label, colorClass };
}

function processTagsString(tags) {
  if (!tags || typeof tags !== 'string') {
    return [];
  }

  return tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
}

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
    profileImageUrl,
    devcourseName,
    devCourseTrack,
    userProfileImg,
    createdAt,
    tags,
    likeCount,
    commentCount,
    comments,
    viewCount,
    status,
  } = post;

  // user 정보 구조 통일
  const user =
    (nickname
      ? {
          nickname,
          profileImageUrl,
          devcourseName,
          devCourseTrack,
          userProfileImg
        }
      : null);

  // commentCount가 없으면 comments 배열 길이로 계산
  const displayCommentCount =
    typeof commentCount === "number"
      ? commentCount
      : Array.isArray(comments)
      ? comments.length
      : 0;

  const validTags = processTagsString(tags);

  return (
    <div
      className="card p-3 shadow-sm board-list-item"
      style={{ cursor: onClick ? "pointer" : "default" }}
      onClick={onClick ? () => onClick(postId) : undefined}
    >
      <div className="d-flex align-items-center mb-2 gap-2">
        <span className={`community-category-label me-1 label-${categoryKey.toUpperCase()}`}>
          {categoryLabel}
        </span>
        {status &&
          (() => {
            const { label, colorClass } = getStatusLabelAndColor(status);
            return (
              <span className={`community-category-label me-2 ${colorClass}`}>
                {label}
              </span>
            );
          })()}
        <span className="fw-bold fs-5 text-truncate">{title}</span>
        <div className="author-info ms-auto text-nowrap">
          <UserInfo user={user} />
          <span className="mx-1">·</span>
          <span className="small">
            {createdAt ? new Date(createdAt).toLocaleDateString() : ""}
          </span>
        </div>
      </div>
      {children}
      <div className="d-flex align-items-center gap-2 mt-2">
        <span className="small tags-container">
          {validTags.map((tag, i) => (
              <span key={i} className="badge bg-light text-dark ms-1">
              #{tag.trim()}
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
