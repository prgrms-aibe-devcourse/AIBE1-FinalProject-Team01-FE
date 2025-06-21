import React from "react";
import "../../styles/components/community/CommunityPostContent.css";

/**
 * @typedef {Object} CommunityPostContentProps
 * @property {object} post - The post object.
 * @property {boolean} [stripImages=false] - If true, removes img tags from the content.
 */

/**
 * 게시글 본문 컴포넌트
 * @param {CommunityPostContentProps} props
 */
export default function CommunityPostContent({ post, stripImages = false }) {
  const contentToRender = stripImages
    ? post.content.replace(/<img[^>]*>/g, "")
    : post.content;

  return (
    <div className="community-detail-content">
      <div
        className="community-detail-content-body"
        dangerouslySetInnerHTML={{ __html: contentToRender }}
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
