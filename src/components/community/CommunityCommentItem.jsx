import React from "react";

/**
 * @typedef {Object} CommunityCommentItemProps
 * @property {object} comment
 */

export default function CommunityCommentItem({ comment }) {
  return (
    <div className="community-detail-comment-item">
      <div className="comment-author-row">
        <img
          src={comment.authorProfileImg}
          alt="프로필"
          className="comment-author-img"
        />
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="d-flex align-items-center">
            <span className="comment-author-name">{comment.author}</span>
            {comment.devcourseName && (
              <span className="comment-author-batch text-primary ms-2">
                {comment.devcourseName}
              </span>
            )}
          </div>
          <span className="comment-date">{comment.date}</span>
        </div>
      </div>
      <div className="comment-content">{comment.content}</div>
      <div className="comment-actions">
        <button className="btn-comment-like">
          <i className="bi bi-heart"></i> {comment.likes}
        </button>
        <button className="btn-comment-reply">답글</button>
      </div>
      {/* 대댓글 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map((reply) => (
            <CommunityCommentItem key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
}
