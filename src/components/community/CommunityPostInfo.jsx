import React from "react";
import { CATEGORY_MAP } from "../../pages/community/communityData";
import UserInfo from "../common/UserInfo";
import { useAuth } from "../../context/AuthContext";
import { isAuthor } from "../../utils/auth";

/**
 * @typedef {Object} CommunityPostInfoProps
 * @property {object} post - The post data object.
 * @property {() => void} onEdit - Function to handle edit action.
 * @property {() => void} onDelete - Function to handle delete action.
 */

/**
 * 게시글 상단 정보 컴포넌트
 * @param {CommunityPostInfoProps} props
 */
export default function CommunityPostInfo({ post, onEdit, onDelete }) {
  const { user } = useAuth();
  const canEditOrDelete = isAuthor(user, post.authorId);

  return (
    <div className="community-detail-info">
      <div className="community-detail-category">
        {CATEGORY_MAP[post.category]}
      </div>
      <div className="community-detail-title-row">
        <h2 className="community-detail-title">{post.title}</h2>
        {canEditOrDelete && (
          <div className="community-detail-actions d-flex align-items-center gap-2">
            <button type="button" onClick={onEdit}>
              수정
            </button>
            <button type="button" onClick={onDelete}>
              삭제
            </button>
          </div>
        )}
      </div>
      <div className="community-detail-meta d-flex justify-content-between align-items-center">
        <UserInfo
          authorProfileImg={post.authorProfileImg}
          author={post.author}
          devcourseName={post.devcourseName}
        />
        <span className="community-detail-date">{post.date}</span>
      </div>
    </div>
  );
}
