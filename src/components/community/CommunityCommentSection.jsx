import React, { useState } from "react";
import CommunityCommentItem from "./CommunityCommentItem";

/**
 * @typedef {Object} CommunityCommentSectionProps
 * @property {string|number} postId
 * @property {Array} comments
 */

/**
 * 댓글 전체 컴포넌트
 * @param {CommunityCommentSectionProps} props
 */
export default function CommunityCommentSection({ postId, commentList = [] }) {
  const [comment, setComment] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    // TODO: 댓글 등록 API 연동
    setComment("");
  };

  return (
    <div className="community-detail-comments">
      <form
        className="community-detail-comment-form"
        onSubmit={handleCommentSubmit}
      >
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="댓글을 작성해주세요"
        />
        <button type="submit">댓글 쓰기</button>
      </form>
      <div className="community-detail-comment-list">
        {commentList.map((c) => (
          <CommunityCommentItem key={c.id} comment={c} />
        ))}
      </div>
    </div>
  );
}
