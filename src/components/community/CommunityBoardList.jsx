import React, { useState } from "react";
import "../../styles/components/community/community.css";
import { CATEGORY_MAP } from "../../pages/community/communityData";
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
  // 북마크
  const [bookmarkState, setBookmarkState] = useState(() =>
    posts.reduce((acc, post) => {
      acc[post.id] = post.bookmarked || false;
      return acc;
    }, {})
  );
  const [bookmarkCounts, setBookmarkCounts] = useState(() =>
    posts.reduce((acc, post) => {
      acc[post.id] = post.bookmarkCount || 0;
      return acc;
    }, {})
  );

  const handleBookmarkClick = (e, post) => {
    e.stopPropagation(); // 카드 클릭 방지
    setBookmarkState((prev) => ({
      ...prev,
      [post.id]: !prev[post.id],
    }));
    setBookmarkCounts((prev) => ({
      ...prev,
      [post.id]: prev[post.id] + (bookmarkState[post.id] ? -1 : 1),
    }));
    // TODO: 백엔드에 북마크 토글 요청 보내기
  };

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
            {/* 북마크 버튼 */}
            <button
              className="btn btn-link p-0 ms-2"
              style={{ fontSize: 22 }}
              onClick={(e) => handleBookmarkClick(e, post)}
              aria-label="북마크"
            >
              <i
                className={
                  bookmarkState[post.id]
                    ? "bi bi-bookmark-fill text-warning"
                    : "bi bi-bookmark"
                }
              ></i>
              <span className="ms-1 small">{bookmarkCounts[post.id]}</span>
            </button>
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
