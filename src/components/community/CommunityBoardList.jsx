import React from "react";
import "../../styles/components/community/community.css";
import { CATEGORY_MAP } from "../../pages/community/constants";
import UserInfo from "../common/UserInfo";

/**
 * @typedef {Object} CommunityBoardListProps
 * @property {Array<Object>} posts
 * @property {string} [categoryLabel]
 * @property {function} [onPostClick]
 */

/**
 * 커뮤니티 게시글 리스트
 * @param {CommunityBoardListProps} props
 */
export const CommunityBoardList = ({ posts, onPostClick }) => {
  return (
    <div className="d-flex flex-column gap-3">
      {posts.map((post, idx) => (
        <div
          key={idx}
          className="card p-3 shadow-sm community-board-list-item"
          style={{ cursor: onPostClick ? "pointer" : "default" }}
          onClick={onPostClick ? () => onPostClick(post.id || idx) : undefined}
        >
          <div className="d-flex align-items-center mb-2 gap-2">
            <span className={`community-category-label label-${post.category}`}>
              {CATEGORY_MAP[post.category]}
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
