import React from "react";

/**
 * @typedef {Object} CommunityBoardListProps
 * @property {Array<Object>} posts
 */

/**
 * 커뮤니티 게시글 리스트
 * @param {CommunityBoardListProps} props
 */
export const CommunityBoardList = ({ posts }) => {
  return (
    <div className="d-flex flex-column gap-3">
      {posts.map((post, idx) => (
        <div key={idx} className="card p-3 shadow-sm">
          <div className="d-flex align-items-center mb-2 gap-2">
            <span className="badge bg-secondary">{post.category}</span>
            <span className="fw-bold fs-5">{post.title}</span>
          </div>
          <div className="mb-2 text-muted">{post.content}</div>
          <div className="d-flex align-items-center gap-2">
            <span className="small">{post.author}</span>
            <span className="small">{post.time}</span>
            <span className="small">
              {post.tags &&
                post.tags.map((tag, i) => (
                  <span key={i} className="badge bg-light text-dark ms-1">
                    {tag}
                  </span>
                ))}
            </span>
            <span className="ms-auto small">
              ❤️ {post.likes} 💬 {post.comments} 👁 {post.views}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
