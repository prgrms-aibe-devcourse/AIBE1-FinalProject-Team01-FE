import React from "react";
import "../../styles/components/board/Board.css";
import "../../styles/components/community/community.css";
import "../../styles/components/info/info.css";
import { DEVCOURSE_LABEL_COLORS } from "../../pages/info/constants";
import InfoPostInfo from "./InfoPostInfo";

/**
 * @typedef {Object} InfoPostCardProps
 * @property {object} post - The post object.
 * @property {(postId: number | string) => void} [onClick] - 카드 클릭 핸들러
 * @property {string} [categoryLabel] - 카테고리 라벨(뱃지)
 * @property {string} [categoryKey] - 카테고리 키(색상용)
 */

/**
 * IT 정보 게시판 전용 카드 컴포넌트
 * @param {InfoPostCardProps} props
 */
export default function InfoPostCard({
  post,
  onClick,
  categoryLabel,
  categoryKey,
}) {
  const {
    postId,
    title,
    devcourseName,
    devcourseBatch,
    createdAt,
    tags,
    likeCount,
    viewCount,
    nickname,
    boardType,
    commentCount,
  } = post;

  // devcourseName 뱃지 색상
  const badgeStyle =
    categoryKey && DEVCOURSE_LABEL_COLORS[categoryKey]
      ? DEVCOURSE_LABEL_COLORS[categoryKey]
      : {};

  const displayCommentCount =
    typeof commentCount === "number" ? commentCount : 0;

  return (
    <div
      className="card p-3 shadow-sm board-list-item"
      style={{ cursor: onClick ? "pointer" : "default" }}
      onClick={onClick ? () => onClick(postId) : undefined}
    >
      {post.postImages && post.postImages.length > 0 && (
        <img
          src={post.postImages[0].imageUrl}
          alt={title}
          className="card-img-top"
          style={{ objectFit: "cover", maxHeight: 180 }}
        />
      )}
      <div className="card-body">
        <div className="d-flex align-items-center mb-2 gap-2">
          {/* REVIEW만 devcourseName 뱃지 */}
          {categoryLabel && (
            <span
              className={`community-category-label me-1`}
              style={{
                background: badgeStyle.background,
                color: badgeStyle.color,
              }}
            >
              {categoryLabel}
            </span>
          )}
          <h5 className="card-title fw-bold fs-5 text-truncate mb-0">
            {title}
          </h5>
          <div className="author-info ms-auto text-nowrap">
            <InfoPostInfo
              devcourseName={devcourseName}
              devcourseBatch={devcourseBatch}
              nickname={nickname}
              boardType={boardType}
            />
            <span className="mx-1">·</span>
            <span className="small">
              {createdAt ? new Date(createdAt).toLocaleDateString() : ""}
            </span>
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between mt-2">
          <div className="d-flex flex-wrap gap-1 tags-container mb-0">
            {tags.split(",").map((tag, i) => (
              <span key={i} className="tag-badge">
                {tag}
              </span>
            ))}
          </div>
          <div className="d-flex gap-3 small text-muted align-items-center">
            <span>
              <i className="bi bi-heart"></i> {likeCount || 0}
            </span>
            <span>
              <i className="bi bi-chat"></i> {displayCommentCount}
            </span>
            <span>
              <i className="bi bi-eye"></i> {viewCount || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
