import React, { useState, useRef, useEffect, useCallback } from "react";
import { CommentItem } from "./CommentItem";
import { useInput } from "../../hooks/useInput";
import { useAuth } from "../../context/AuthContext";

/**
 * @typedef {Object} CommentSectionProps
 * @property {string|number} postId
 * @property {Array} comments
 * @property {(content: string) => void} onCommentAdd - Function to handle adding a new comment.
 * @property {(parentId: string, content: string) => void} onReplyAdd - Function to handle adding a reply.
 * @property {(commentId: string) => void} onDelete - Function to handle comment deletion.
 * @property {(commentId: string, newContent: string) => void} onEdit - Function to handle comment editing.
 * @property {(commentId: string) => void} onLikeToggle - Function to handle like toggling.
 */

/**
 * 댓글 전체 컴포넌트
 * @param {CommentSectionProps} props
 */
export const CommentSection = (props) => {
  const {
    postId,
    comments: initialComments = [],
    onCommentAdd,
    onReplyAdd,
    onDelete,
    onEdit,
    onLikeToggle,
  } = props;

  const {
    value: comment,
    onChange: onCommentChange,
    reset: resetComment,
  } = useInput("");
  const [comments, setComments] = useState(initialComments);
  const [commentsToShow, setCommentsToShow] = useState(5);
  const loaderRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        setCommentsToShow((prev) => Math.min(prev + 5, comments.length));
      }
    },
    [comments.length]
  );

  useEffect(() => {
    if (comments.length <= 5) return;
    const option = { root: null, rootMargin: "0px", threshold: 0.1 };
    const observer = new window.IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [handleObserver, comments.length]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim() || !onCommentAdd) return;
    onCommentAdd(comment);
    resetComment();
  };

  const sortedComments = comments.slice().sort((a, b) => a.id - b.id);
  const visibleComments = sortedComments.slice(0, commentsToShow);

  return (
    <div className="community-detail-comments">
      <form
        className="community-detail-comment-form"
        onSubmit={handleCommentSubmit}
      >
        <input
          type="text"
          value={comment}
          onChange={onCommentChange}
          placeholder="댓글을 작성해주세요"
        />
        <button type="submit">댓글 쓰기</button>
      </form>
      <div className="community-detail-comment-list">
        {visibleComments.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            user={user}
            onReplyAdd={onReplyAdd}
            onLike={onLikeToggle}
            onDelete={onDelete}
            onEdit={onEdit}
            depth={1}
          />
        ))}
        {commentsToShow < comments.length && (
          <div ref={loaderRef} style={{ height: 32 }} />
        )}
      </div>
    </div>
  );
};
