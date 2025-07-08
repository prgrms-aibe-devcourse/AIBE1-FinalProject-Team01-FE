import React from "react";
import "../../styles/components/info/info.css";
import { INFO_CATEGORY_LABELS } from "../../pages/info/constants";
import { PostCard } from "../board/PostCard";

/**
 * @typedef {Object} Post
 * @property {string | number} postId - 게시글 ID
 * @property {string | number} itId - IT ID
 * @property {string} boardType - 게시글 타입 (REVIEW, NEWS)
 * @property {string} title - 게시글 제목
 * @property {string} content - 게시글 내용
 * @property {Object} author - 작성자 정보
 * @property {string} createdAt - 작성일
 */

/**
 * @typedef {Object} InfoBoardListProps
 * @property {Array<Post>} posts - 게시글 목록
 * @property {(id: string | number) => void} [onPostClick] - 게시글 클릭 핸들러
 */

/**
 * Info 게시글 리스트 컴포넌트
 * @param {InfoBoardListProps} props
 */
export const InfoBoardList = ({ posts, onPostClick }) => {
  return (
    <div className="d-flex flex-column gap-3">
      {posts.map((post) => (
        <PostCard
          key={post.itId}
          post={post}
          onClick={() => onPostClick?.(post.itId || post.id)}
          categoryLabel={INFO_CATEGORY_LABELS[post.boardType] || post.boardType}
          categoryKey={post.boardType}
        />
      ))}
    </div>
  );
};

export default InfoBoardList;
