import React, { useState } from "react";
import { BoardTagShareBar } from "./BoardTagShareBar";
import { CommentSection } from "../comment/CommentSection";
import { createDummyComment } from "../../pages/community/communityData";

/**
 * @typedef {Object} BoardDetailLayoutProps
 * @property {object} post - The post data object.
 * @property {React.ReactNode} children - The unique content for each board detail page.
 */

/**
 * 게시글 상세 페이지 공통 레이아웃
 * @param {BoardDetailLayoutProps} props
 */
export const BoardDetailLayout = ({ post, children }) => {
  const [bookmarked, setBookmarked] = useState(post.bookmarked || false);
  const [bookmarkCount, setBookmarkCount] = useState(post.bookmarkCount || 0);
  const [comments, setComments] = useState(post.comments || []);

  const handleBookmarkClick = () => {
    setBookmarked((prev) => !prev);
    setBookmarkCount((prev) => prev + (bookmarked ? -1 : 1));
    // TODO: 백엔드에 북마크 토글 요청 보내기
  };

  const handleCommentAdd = (content) => {
    const newComment = createDummyComment(content);
    setComments((prev) => [newComment, ...prev]);
  };

  const handleReplyAdd = (parentId, content) => {
    const newReply = createDummyComment(content);

    const addReplyToComment = (comments, pId) => {
      return comments.map((comment) => {
        if (comment.id === pId) {
          const newReplies = comment.replies
            ? [...comment.replies, newReply]
            : [newReply];
          return { ...comment, replies: newReplies };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: addReplyToComment(comment.replies, pId),
          };
        }
        return comment;
      });
    };
    setComments((prev) => addReplyToComment(prev, parentId));
  };

  const handleCommentDelete = (commentId) => {
    console.log("Delete comment:", commentId);
    // 상태 업데이트 로직 추가 필요
  };

  const handleCommentEdit = (commentId, newContent) => {
    console.log("Edit comment:", commentId, newContent);
    // 상태 업데이트 로직 추가 필요
  };

  const handleCommentLike = (commentId) => {
    console.log("Like comment:", commentId);
    // 상태 업데이트 로직 추가 필요
  };

  return (
    <div className="community-detail-container">
      {children}
      <BoardTagShareBar
        tags={post.tags}
        likes={post.likes}
        bookmarked={bookmarked}
        bookmarkCount={bookmarkCount}
        onBookmarkToggle={handleBookmarkClick}
      />
      <CommentSection
        postId={post.id}
        comments={comments}
        onCommentAdd={handleCommentAdd}
        onReplyAdd={handleReplyAdd}
        onDelete={handleCommentDelete}
        onEdit={handleCommentEdit}
        onLikeToggle={handleCommentLike}
      />
    </div>
  );
};
