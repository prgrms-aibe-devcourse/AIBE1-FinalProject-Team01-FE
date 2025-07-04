import React, { useRef, useEffect, useCallback } from "react";
import { CommentItem } from "./CommentItem";
import { useInput } from "../../hooks/useInput";
import { useAuth } from "../../context/AuthContext";
import { useComments } from "../../hooks/useComments";

/**
 * @typedef {Object} CommentSectionProps
 * @property {string|number} postId
 * @property {Array} comments
 */

/**
 * 댓글 전체 컴포넌트 (자체적으로 상태 및 로직 관리)
 * @param {CommentSectionProps} props
 */
const CommentSection = ({ postId, comments: initialComments = [] }) => {
  const { value, onChange, reset } = useInput("");
  const loaderRef = useRef(null);
  const { user } = useAuth();
  const {
    comments,
    handleCommentAdd,
    handleReplyAdd,
    handleCommentEdit,
    handleCommentDelete,
    setComments,
  } = useComments(initialComments, postId);
  const [commentsToShow, setCommentsToShow] = React.useState(5);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments, setComments]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    handleCommentAdd(value);
    reset();
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

  const topLevelComments = comments.filter((c) => c.parentCommentId == null);
  const sortedComments = topLevelComments
    .slice()
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const visibleComments = sortedComments.slice(0, commentsToShow);

  return (
    <div className="community-detail-comments">
      <form className="community-detail-comment-form" onSubmit={handleAdd}>
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
            onEdit={handleCommentEdit}
            onDelete={handleCommentDelete}
            depth={1}
            allComments={comments}
          />
        ))}
        {commentsToShow < topLevelComments.length && (
          <div ref={loaderRef} style={{ height: 32 }} />
        )}
      </div>
    </div>
  );
};

export default CommentSection;
