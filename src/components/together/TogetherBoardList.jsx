import React from "react";
import { PostCard } from "../board/PostCard";
import { TOGETHER_CATEGORIES } from "../../pages/together/constants";

/**
 * @typedef {Object} TogetherBoardListProps
 * @property {Array<Object>} posts
 * @property {(id: string | number) => void} [onPostClick]
 */

/**
 * 함께해요 게시글 리스트 (스터디, 프로젝트, 커피챗, 멘토링)
 * @param {TogetherBoardListProps} props
 */
export const TogetherBoardList = ({ posts, onPostClick }) => {
  return (
    <div className="d-flex flex-column gap-3">
      {posts.map((post) => {
        const { gathering_post } = post;
        if (!gathering_post) return null;

        const categoryKey = gathering_post.gathering_type; // 영문
        const categoryLabel = TOGETHER_CATEGORIES[categoryKey]; // 한글

        return (
          <PostCard
            key={post.id}
            post={post}
            onClick={onPostClick}
            categoryLabel={categoryLabel}
            categoryKey={categoryKey}
          >
            <div className="row mt-2 mb-2 info-grid">
              {gathering_post.headCount != null && (
                <div className="col-md-3 col-6">
                  <i className="bi bi-people"></i>
                  <span> {gathering_post.headCount}명</span>
                </div>
              )}
              {gathering_post.place && (
                <div className="col-md-3 col-6">
                  <i className="bi bi-geo-alt"></i>
                  <span> {gathering_post.place}</span>
                </div>
              )}
              {gathering_post.period && (
                <div className="col-md-3 col-6">
                  <i className="bi bi-calendar-range"></i>
                  <span> {gathering_post.period}</span>
                </div>
              )}
              {/* `timeText`는 DB 스키마에 없으므로 일단 제거합니다. */}
            </div>
          </PostCard>
        );
      })}
    </div>
  );
};
