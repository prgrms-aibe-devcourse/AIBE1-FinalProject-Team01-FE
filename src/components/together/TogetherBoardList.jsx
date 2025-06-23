import React from "react";
import { PostCard } from "../board/PostCard";
import {
  TOGETHER_TYPE_LABELS,
  GATHERING_STATUS_LABELS,
  MATCH_STATUS_LABELS,
  RECRUITMENT_TYPE_LABELS,
} from "../../pages/together/constants";

/**
 * 게시글의 유형(gathering or match)에 따라 추가 정보를 표시하는 컴포넌트
 * @param {object} props
 * @param {object} props.post - The post object, aligned with backend DTO.
 */
const TogetherPostInfo = ({ post }) => {
  if (post.gatheringType) {
    // 스터디/프로젝트(gathering) 게시글 정보
    return (
      <div className="row g-2 align-items-center text-muted small mt-1">
        <div className="col-md-3 col-6">
          <i className="bi bi-geo-alt me-1"></i> {post.place || "온라인"}
        </div>
        <div className="col-md-3 col-6">
          <i className="bi bi-calendar-range me-1"></i> {post.period}
        </div>
        <div className="col-md-3 col-6">
          <i className="bi bi-people me-1"></i> {post.headCount}명
        </div>
        <div className="col-md-3 col-6">
          <strong>기술:</strong>{" "}
          {post.requiredSkills?.slice(0, 2).join(", ") || "미지정"}
        </div>
      </div>
    );
  }

  if (post.matchType) {
    // 커피챗/멘토링(match) 게시글 정보
    return (
      <div className="row g-2 align-items-center text-muted small mt-1">
        <div className="col-12">
          <strong>모집 분야:</strong>{" "}
          <span>{RECRUITMENT_TYPE_LABELS[post.recruitmentType]}</span>
        </div>
      </div>
    );
  }

  return null;
};

/**
 * 함께해요 게시글 리스트 (스터디, 프로젝트, 커피챗, 멘토링)
 * @param {object} props
 * @property {Array<Object>} props.posts - Array of post objects.
 * @property {(id: string | number) => void} [props.onPostClick]
 */
export const TogetherBoardList = ({ posts, onPostClick }) => {
  return (
    <div className="d-flex flex-column gap-3">
      {posts.map((post) => {
        const type = post.gatheringType || post.matchType;
        const status = post.status;

        const categoryLabel = TOGETHER_TYPE_LABELS[type];
        const statusLabel = post.gatheringType
          ? GATHERING_STATUS_LABELS[status]
          : MATCH_STATUS_LABELS[status];

        return (
          <PostCard
            key={post.postId}
            post={post}
            onClick={onPostClick}
            categoryLabel={categoryLabel}
            categoryKey={type?.toLowerCase()}
            statusLabel={statusLabel}
          >
            <TogetherPostInfo post={post} />
          </PostCard>
        );
      })}
    </div>
  );
};

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
