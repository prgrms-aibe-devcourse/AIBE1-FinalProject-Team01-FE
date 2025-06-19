import React from "react";
import CommunityPostInfo from "./CommunityPostInfo";
import CommunityPostContent from "./CommunityPostContent";
import CommunityTagShareBar from "./CommunityTagShareBar";
import CommunityCommentSection from "./CommunityCommentSection";

/**
 * @typedef {Object} CommunityBoardDetailProps
 * @property {object} post
 */

/**
 * 커뮤니티 글 상세 메인 컴포넌트
 * @param {CommunityBoardDetailProps} props
 */
export default function CommunityBoardDetail({ post }) {
  return (
    <div className="community-detail-container">
      <CommunityPostInfo post={post} />
      <CommunityPostContent post={post} />
      <CommunityTagShareBar tags={post.tags} likes={post.likes} />
      <CommunityCommentSection
        postId={post.id}
        commentList={post.commentList}
      />
    </div>
  );
}
