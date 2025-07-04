import React from "react";
import "../../styles/components/common/PostContent.css";

/**
 * @typedef {Object} PostContentProps
 * @property {object} post - The post object.
 */

/**
 * 게시글 본문 컴포넌트
 * @param {PostContentProps} props
 */
export const PostContent = ({ post }) => {
  if (!post || !post.content) {
    return null;
  }

  return (
    <div className="post-content">
      <div
        className="post-content-body"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      {post.contentList && (
        <ul className="post-content-list">
          {post.contentList.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
