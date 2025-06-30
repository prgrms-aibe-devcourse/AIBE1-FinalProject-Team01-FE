import React from "react";
import "../../styles/components/community/community.css";
import { BOARD_TYPE_LABEL } from "../../pages/community/constants";
import { PostCard } from "../board/PostCard";

/**
 * @typedef {Object} Post
 * @property {string | number} postId - 게시글 ID
 * @property {string} boardType - 게시글 타입 (FREE, QNA, RETROSPECT)
 * @property {string} title - 게시글 제목
 * @property {string} content - 게시글 내용
 * @property {Object} author - 작성자 정보
 * @property {string} createdAt - 작성일
 */

/**
 * @typedef {Object} CommunityBoardListProps
 * @property {Array<Post>} posts - 게시글 목록
 * @property {(id: string | number) => void} [onPostClick] - 게시글 클릭 핸들러
 */

/**
 * 커뮤니티 게시글 리스트 컴포넌트
 * @param {CommunityBoardListProps} props
 */
export const CommunityBoardList = ({ posts, onPostClick }) => {
  return (
    <div className="d-flex flex-column gap-3">
      {posts.map((post) => (
        <PostCard
          key={post.postId}
          post={post}
          onClick={() => onPostClick?.(post.postId)}
          categoryLabel={BOARD_TYPE_LABEL[post.boardType] || post.boardType}
          categoryKey={post.boardType}
        />
      ))}
    </div>
  );
};
