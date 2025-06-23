import React from "react";
import { PostCard } from "../board/PostCard";
import {
  TOGETHER_CATEGORIES,
  RECRUITMENT_TYPES,
} from "../../pages/together/constants";

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
        const gathering_post = post.gathering_post;
        const isMatch =
          gathering_post.gathering_type === "mentoring" ||
          gathering_post.gathering_type === "coffeechat";
        const recruitmentTypeLabel =
          RECRUITMENT_TYPES[gathering_post.recruitment_type];
        return (
          <PostCard
            key={post.id}
            post={post}
            onClick={onPostClick}
            categoryLabel={TOGETHER_CATEGORIES[gathering_post.gathering_type]}
            categoryKey={gathering_post.gathering_type}
          >
            <div className="row g-2 align-items-center">
              <div className="col-md-3 col-6">
                <i className="bi bi-geo-alt"></i> {gathering_post.place}
              </div>
              <div className="col-md-3 col-6">
                <i className="bi bi-calendar"></i> {gathering_post.day}
              </div>
              {isMatch ? (
                <div className="col-md-3 col-6">
                  <strong>모집 분야:</strong>{" "}
                  <span>{recruitmentTypeLabel}</span>
                </div>
              ) : (
                <div className="col-md-3 col-6">
                  <i className="bi bi-calendar-range"></i>{" "}
                  {gathering_post.period}
                </div>
              )}
              <div className="col-md-3 col-6">
                <i className="bi bi-people"></i> {gathering_post.headCount}명
              </div>
            </div>
          </PostCard>
        );
      })}
    </div>
  );
};
