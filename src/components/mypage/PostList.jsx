import React from "react";

/**
 * @typedef {Object} PostListProps
 * @property {"posts"|"likes"|"bookmarks"} type
 */

const DUMMY = {
  posts: [
    { id: 1, title: "내가 쓴 글 1", date: "2024-06-01" },
    { id: 2, title: "내가 쓴 글 2", date: "2024-06-02" },
  ],
  likes: [{ id: 3, title: "좋아요한 글 1", date: "2024-05-30" }],
  bookmarks: [{ id: 4, title: "북마크한 글 1", date: "2024-05-28" }],
};

/**
 * 작성글/좋아요/북마크 리스트
 * @param {PostListProps} props
 */
export const PostList = ({ type }) => {
  const list = DUMMY[type] || [];
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
