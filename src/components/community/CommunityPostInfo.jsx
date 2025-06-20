import React from "react";
import { CATEGORY_MAP } from "../../pages/community/communityData";
import UserInfo from "../common/UserInfo";
import { useAuth } from "../../context/AuthContext";

/**
 * @typedef {Object} CommunityPostInfoProps
 * @property {object} post
 * @property {() => void} onEdit
 * @property {() => void} onDelete
 */

/**
 * 게시글 상단 정보 컴포넌트
 * @param {CommunityPostInfoProps} props
 */
export default function CommunityPostInfo({ post, onEdit, onDelete }) {
  const { user } = useAuth();
  const isAuthor = user && user.name === post.author; // user.name은 실제 로그인 정보에 맞게 조정
  return (
    <div className="community-detail-info">
      <div className="community-detail-category">
        {CATEGORY_MAP[post.category]}
      </div>
      <div className="community-detail-title-row">
        <h2 className="community-detail-title">{post.title}</h2>
        <div className="community-detail-actions d-flex align-items-center gap-2">
          {/* 작성자만 보이도록 처리, TODO: 백엔드에서 권한 검증 필요 */}
          {isAuthor && (
            <>
              <button type="button" onClick={onEdit}>
                수정
              </button>
              <button type="button" onClick={onDelete}>
                삭제
              </button>
            </>
          )}
        </div>
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
