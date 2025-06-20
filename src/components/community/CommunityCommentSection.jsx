import React, { useState, useRef, useEffect, useCallback } from "react";
import CommunityCommentItem from "./CommunityCommentItem";
import { createDummyComment } from "../../pages/community/communityData";
import { useInput } from "../../hooks/useInput";
import { useAuth } from "../../context/AuthContext";

/**
 * @typedef {Object} CommunityCommentSectionProps
 * @property {string|number} postId
 * @property {Array} comments
 */

/**
 * 댓글 전체 컴포넌트
 * @param {CommunityCommentSectionProps} props
 */

// 재귀적으로 parentId를 찾아 replies에 답글을 추가하는 함수
function addReplyRecursive(comments, parentId, replyContent) {
  return comments.map((c) => {
    if (c.id === parentId) {
      return {
        ...c,
        replies: [...(c.replies || []), createDummyComment(replyContent)],
      };
    }
    if (Array.isArray(c.replies) && c.replies.length > 0) {
      return {
        ...c,
        replies: addReplyRecursive(c.replies, parentId, replyContent),
      };
    }
    return c;
  });
}

// 재귀적으로 commentId를 찾아 삭제하는 함수
function deleteCommentRecursive(comments, commentId) {
  return comments
    .filter((c) => c.id !== commentId)
    .map((c) =>
      Array.isArray(c.replies) && c.replies.length > 0
        ? { ...c, replies: deleteCommentRecursive(c.replies, commentId) }
        : c
    );
}

// 재귀적으로 commentId를 찾아 content를 수정하는 함수
function editCommentRecursive(comments, commentId, newContent) {
  return comments.map((c) => {
    if (c.id === commentId) {
      return { ...c, content: newContent };
    }
    if (Array.isArray(c.replies) && c.replies.length > 0) {
      return {
        ...c,
        replies: editCommentRecursive(c.replies, commentId, newContent),
      };
    }
    return c;
  });
}

export default function CommunityCommentSection({ postId, commentList = [] }) {
  const {
    value: comment,
    onChange: onCommentChange,
    reset: resetComment,
  } = useInput("");
  const [comments, setComments] = useState(commentList);
  const [commentsToShow, setCommentsToShow] = useState(5);
  const loaderRef = useRef(null);
  const { user } = useAuth();
  const isAuthor = user && user.name === comment.author; // 또는 user.id === comment.authorId 등

  // 무한 스크롤 Intersection Observer (5개 단위)
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

  // 댓글 추가
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const newComment = createDummyComment(comment);
    setComments([newComment, ...comments]);
    resetComment();
    setCommentsToShow((prev) => prev + 1); // 새 댓글 추가 시 보여지는 개수 증가
  };

  // 답글 추가
  const handleReplyAdd = (parentId, replyContent) => {
    setComments((prevComments) =>
      addReplyRecursive(prevComments, parentId, replyContent)
    );
  };

  // 삭제 핸들러
  const handleDelete = (commentId) => {
    setComments((prevComments) =>
      deleteCommentRecursive(prevComments, commentId)
    );
  };

  // 수정 핸들러
  const handleEdit = (commentId, newContent) => {
    setComments((prevComments) =>
      editCommentRecursive(prevComments, commentId, newContent)
    );
  };

  // 좋아요 토글
  const handleLikeToggle = (commentId) => {
    setComments((prevComments) =>
      prevComments.map((c) =>
        c.id === commentId
          ? {
              ...c,
              likes: c.liked ? c.likes - 1 : c.likes + 1,
              liked: !c.liked,
              // TODO: 백엔드에 좋아요/취소 요청 보내기
            }
          : {
              ...c,
              replies: c.replies
                ? c.replies.map((r) =>
                    r.id === commentId
                      ? {
                          ...r,
                          likes: r.liked ? r.likes - 1 : r.likes + 1,
                          liked: !r.liked,
                          // TODO: 백엔드에 좋아요/취소 요청 보내기
                        }
                      : r
                  )
                : [],
            }
      )
    );
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
          <CommunityCommentItem
            key={c.id}
            comment={c}
            user={user}
            onReplyAdd={handleReplyAdd}
            onLike={handleLikeToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
            liked={c.liked}
            depth={1}
          >
            {isAuthor && (
              <>
                <button>수정</button>
                <button>삭제</button>
              </>
            )}
          </CommunityCommentItem>
        ))}
        {commentsToShow < comments.length && (
          <div ref={loaderRef} style={{ height: 32 }} />
        )}
      </div>
    </div>
  );
}
