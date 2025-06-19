import React from "react";
import { CATEGORY_MAP } from "../../pages/community/communityData";

/**
 * @typedef {Object} CommunityPostInfoProps
 * @property {object} post
 */

/**
 * 게시글 상단 정보 컴포넌트
 * @param {CommunityPostInfoProps} props
 */
export default function CommunityPostInfo({ post }) {
  return (
    <div className="community-detail-info">
      <div className="community-detail-category">
        {CATEGORY_MAP[post.category]}
      </div>
      <div className="community-detail-title-row">
        <h2 className="community-detail-title">{post.title}</h2>
        <div className="community-detail-actions">
          {/* TODO: 수정/삭제 기능 연동 */}
          <button className="btn-edit">수정</button>
          <button className="btn-delete">삭제</button>
        </div>
      </div>
      <div className="community-detail-meta d-flex justify-content-between align-items-center">
        <div className="community-detail-author">
          <img
            src={post.authorProfileImg}
            alt="프로필"
            className="author-img"
          />
          <span className="author-name">{post.author}</span>
          <span className="author-batch">{post.devcourseName}</span>
        </div>
        <span className="community-detail-date">{post.date}</span>
      </div>
    </div>
  );
}
