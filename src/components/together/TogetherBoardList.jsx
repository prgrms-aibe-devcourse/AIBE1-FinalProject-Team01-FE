import React from "react";
import { PostCard } from "../board/PostCard";
import { categoryLabelToSlug } from "../../pages/together/constants";

/**
 * @typedef {Object} TogetherBoardListProps
 * @property {Array<Object>} posts
 * @property {(id: string | number) => void} [onPostClick]
 */

/**
 * 함께해요 게시글 리스트
 * @param {TogetherBoardListProps} props
 */
export const TogetherBoardList = ({ posts, onPostClick }) => {
  return (
    <div className="d-flex flex-column gap-3">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onClick={onPostClick}
          categoryLabel={post.categoryLabel}
          categoryKey={categoryLabelToSlug[post.categoryLabel]}
        >
          <div className="row mt-2 mb-2 info-grid">
            {post.recruitCount != null && (
              <div className="col-md-3 col-6">
                <i className="bi bi-people"></i>
                <span> {post.recruitCount}명</span>
              </div>
            )}
            {post.location && (
              <div className="col-md-3 col-6">
                <i className="bi bi-geo-alt"></i>
                <span> {post.location}</span>
              </div>
            )}
            {post.period && (
              <div className="col-md-3 col-6">
                <i className="bi bi-calendar-range"></i>
                <span> {post.period}</span>
              </div>
            )}
            {post.timeText && (
              <div className="col-md-3 col-6">
                <i className="bi bi-calendar-check"></i>
                <span> {post.timeText}</span>
              </div>
            )}
          </div>
        </PostCard>
      ))}
    </div>
  );
};
