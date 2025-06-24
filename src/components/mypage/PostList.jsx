import React from "react";

/**
 * @typedef {Object} PostListProps
 * @property {"posts"|"likes"|"bookmarks"} type
 * @property {Array} data
 */

/**
 * 작성글/좋아요/북마크 리스트
 * @param {PostListProps} props
 */
export const PostList = ({ type, data = [] }) => {
  const list = data;
  return (
    <div className="mt-3">
      {list.length === 0 ? (
        <div className="text-muted">표시할 글이 없습니다.</div>
      ) : (
        <ul className="list-group">
          {list.map((post) => (
            <li
              className="list-group-item d-flex justify-content-between align-items-center"
              key={post.id}
            >
              <span>{post.title}</span>
              <span className="text-secondary" style={{ fontSize: 13 }}>
                {post.date}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
