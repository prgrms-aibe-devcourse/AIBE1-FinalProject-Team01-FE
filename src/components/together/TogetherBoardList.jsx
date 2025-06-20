import React from "react";

/**
 * @typedef {Object} TogetherBoardListProps
 * @property {Array<Object>} posts
 * @property {function} [onPostClick]
 */

/**
 * 함께해요 게시글 리스트 (카테고리 라벨, 모집인원/장소/시간/기간 등 노출)
 * @param {TogetherBoardListProps} props
 */
export const TogetherBoardList = ({ posts, onPostClick }) => {
  return (
    <div className="d-flex flex-column gap-3">
      {posts.map((post, idx) => (
        <div
          key={post.id || idx}
          className="card p-3 shadow-sm together-board-list-item"
          style={{ cursor: onPostClick ? "pointer" : "default" }}
          onClick={onPostClick ? () => onPostClick(post.id || idx) : undefined}
        >
          <div className="d-flex align-items-center mb-2 gap-2">
            {/* 카테고리 라벨 */}
            <span className="badge bg-secondary me-2">
              {post.categoryLabel}
            </span>
            <span className="fw-bold fs-5">{post.title}</span>
            <div className="author-info ms-auto">
              <span className="author-name">{post.author}</span>
              {post.devcourseName && (
                <span className="author-batch">{post.devcourseName}</span>
              )}
              <span className="mx-1">·</span>
              <span className="small">{post.time}</span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-4 mb-2">
            {post.recruitCount && <span>👥 {post.recruitCount}명</span>}
            {post.location && <span>📍 {post.location}</span>}
            {post.timeText && <span>🕒 {post.timeText}</span>}
            {post.period && <span>⏰ {post.period}</span>}
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="small">
              {post.tags &&
                post.tags.map((tag, i) => (
                  <span key={i} className="badge bg-light text-dark ms-2 fs-6">
                    {tag}
                  </span>
                ))}
            </span>
            <span className="ms-auto small d-flex align-items-center gap-3">
              <span>
                <i className="bi bi-heart"></i> {post.likes}
              </span>
              <span>
                <i className="bi bi-chat"></i>{" "}
                {Array.isArray(post.comments)
                  ? post.comments.length
                  : post.comments || 0}
              </span>
              <span>
                <i className="bi bi-eye"></i> {post.views}
              </span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
