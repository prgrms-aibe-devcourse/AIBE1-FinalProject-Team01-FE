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

// 트리 깊은 복사 함수
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// 답글 추가(반복문, 깊은 복사)
function addReplyIterative(comments, parentId, replyContent) {
  const newComments = deepClone(comments);
  const stack = [];
  for (let i = 0; i < newComments.length; i++) {
    stack.push(newComments[i]);
  }
  while (stack.length) {
    const node = stack.pop();
    if (node.id === parentId) {
      node.replies = [
        ...(node.replies || []),
        createDummyComment(replyContent),
      ];
      break;
    }
    if (Array.isArray(node.replies)) {
      for (let j = 0; j < node.replies.length; j++) {
        stack.push(node.replies[j]);
      }
    }
  }
  return newComments;
}

// 댓글 삭제(반복문, 깊은 복사)
function deleteCommentIterative(comments, commentId) {
  const newComments = deepClone(comments);
  function removeById(arr) {
    return arr
      .filter((c) => c.id !== commentId)
      .map((c) => ({
        ...c,
        replies: c.replies ? removeById(c.replies) : [],
      }));
  }
  return removeById(newComments);
}

// 댓글 수정(반복문, 깊은 복사)
function editCommentIterative(comments, commentId, newContent) {
  const newComments = deepClone(comments);
  const stack = [];
  for (let i = 0; i < newComments.length; i++) {
    stack.push(newComments[i]);
  }
  while (stack.length) {
    const node = stack.pop();
    if (node.id === commentId) {
      node.content = newContent;
      break;
    }
    if (Array.isArray(node.replies)) {
      for (let j = 0; j < node.replies.length; j++) {
        stack.push(node.replies[j]);
      }
    }
  }
  return newComments;
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
      addReplyIterative(prevComments, parentId, replyContent)
    );
  };

  // 삭제 핸들러
  const handleDelete = (commentId) => {
    setComments((prevComments) =>
      deleteCommentIterative(prevComments, commentId)
    );
  };

  // 수정 핸들러
  const handleEdit = (commentId, newContent) => {
    setComments((prevComments) =>
      editCommentIterative(prevComments, commentId, newContent)
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
