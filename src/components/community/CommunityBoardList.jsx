import React from "react";
import "../../styles/components/community/community.css";
import { CATEGORY_MAP } from "../../pages/community/constants";
import { PostCard } from "../board/PostCard";

/**
 * @typedef {Object} CommunityBoardListProps
 * @property {Array<Object>} posts
 * @property {(id: string | number) => void} [onPostClick]
 */

/**
 * 커뮤니티 게시글 리스트
 * @param {CommunityBoardListProps} props
 */
export const CommunityBoardList = ({ posts, onPostClick }) => {
  return (
    <div className="d-flex flex-column gap-3">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onClick={onPostClick}
          categoryLabel={CATEGORY_MAP[post.category] || post.category}
          categoryKey={post.category}
        />
      ))}
    </div>
  );
};
