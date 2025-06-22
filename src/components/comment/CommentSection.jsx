import React, { useState, useRef, useEffect, useCallback } from "react";
import { CommentItem } from "./CommentItem";
import { useInput } from "../../hooks/useInput";
import { useAuth } from "../../context/AuthContext";
import { createCommentObject } from "../../lib/comment-utils";

/**
 * @typedef {Object} CommentSectionProps
 * @property {string|number} postId
 * @property {Array} comments
 */

/**
 * 댓글 전체 컴포넌트 (자체적으로 상태 및 로직 관리)
 * @param {CommentSectionProps} props
 */
export const CommentSection = ({ postId, comments: initialComments = [] }) => {
  const { value, onChange, reset } = useInput("");
  const [comments, setComments] = useState(initialComments);
  const [commentsToShow, setCommentsToShow] = useState(5);
  const loaderRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleCommentAdd = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    const newComment = createCommentObject(value, user, postId);
    setComments((prev) => [newComment, ...prev]);
    reset();
  };

  const handleReplyAdd = (parentId, content) => {
    const newReply = createCommentObject(content, user, postId, parentId);
    const addReplyIterative = (comments, pId, reply) => {
      const clonedComments = JSON.parse(JSON.stringify(comments));
      const stack = [...clonedComments].reverse();

      while (stack.length > 0) {
        const current = stack.pop();

        if (current.id === pId) {
          current.replies = [...(current.replies || []), reply];
          return clonedComments;
        }

        if (current.replies && current.replies.length > 0) {
          for (let i = current.replies.length - 1; i >= 0; i--) {
            stack.push(current.replies[i]);
          }
        }
      }
      return clonedComments;
    };
    setComments((prev) => addReplyIterative(prev, parentId, newReply));
  };

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

  const sortedComments = comments.slice().sort((a, b) => a.id - b.id);
  const visibleComments = sortedComments.slice(0, commentsToShow);

  return (
    <div className="community-detail-comments">
      <form
        className="community-detail-comment-form"
        onSubmit={handleCommentAdd}
      >
        <input
          type="text"
          value={value}
          onChange={onChange}
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
            onReplyAdd={handleReplyAdd}
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
