import React, { useState } from "react";
import CommunityCommentItem from "./CommunityCommentItem";
import { createDummyComment } from "../../pages/community/communityData";
import { useInput } from "../../hooks/useInput";

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
  const {
    value: comment,
    onChange: onCommentChange,
    reset: resetComment,
  } = useInput("");
  const [comments, setComments] = useState(commentList);

  // TODO : 댓글 추가
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const newComment = createDummyComment(comment);
    setComments([newComment, ...comments]);
    resetComment();
  };

  // TODO : 답글 추가
  const handleReplyAdd = (parentId, replyContent) => {
    setComments((prevComments) =>
      prevComments.map((c) =>
        c.id === parentId
          ? {
              ...c,
              replies: [...c.replies, createDummyComment(replyContent)],
            }
          : {
              ...c,
              replies: c.replies
                ? c.replies.map((r) =>
                    r.id === parentId
                      ? {
                          ...r,
                          replies: [
                            ...r.replies,
                            createDummyComment(replyContent),
                          ],
                        }
                      : r
                  )
                : [],
            }
      )
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
        {comments
          .slice()
          .sort((a, b) => a.id - b.id)
          .map((c) => (
            <CommunityCommentItem
              key={c.id}
              comment={c}
              onReplyAdd={handleReplyAdd}
              onLike={handleLikeToggle}
              liked={c.liked}
            />
          ))}
      </div>
    </div>
  );
}
