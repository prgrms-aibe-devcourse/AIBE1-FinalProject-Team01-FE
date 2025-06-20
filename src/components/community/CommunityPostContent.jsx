import React from "react";

/**
 * @typedef {Object} CommunityPostContentProps
 * @property {object} post
 */

/**
 * 게시글 본문 컴포넌트
 * @param {CommunityPostContentProps} props
 */
export default function CommunityPostContent({ post }) {
  return (
    <div className="community-detail-content">
      {post.image && (
        <img
          src={post.image}
          alt="본문 이미지"
          className="community-detail-image"
        />
      )}
      <div
        className="community-detail-content-body"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      {post.contentList && (
        <ul className="community-detail-content-list">
          {post.contentList.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
