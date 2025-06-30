import React from "react";
import { PostCard } from "../board/PostCard";
import { BOARD_TYPE_LABEL } from "../../pages/community/constants";

/**
 * @typedef {Object} PostListProps
 * @property {"posts"|"likes"|"bookmarks"} type
 * @property {Array} data
 * @property {(post: object) => void} [onPostClick] // 게시글 클릭 핸들러
 */

/**
 * 작성글/좋아요/북마크 리스트
 * @param {PostListProps} props
 */
export const PostList = ({ type, data = [], onPostClick }) => {
  return (
    <div className="d-flex flex-column gap-3">
      {data.length === 0 ? (
        <div className="text-muted">표시할 글이 없습니다.</div>
      ) : (
        data.map((post) => (
          <PostCard
            key={post.postId || post.id}
            post={post}
            onClick={onPostClick ? () => onPostClick(post) : undefined}
            categoryLabel={
              BOARD_TYPE_LABEL[post.boardType] || post.boardType || type
            }
            categoryKey={post.boardType || type}
          />
        ))
      )}
    </div>
  );
};
