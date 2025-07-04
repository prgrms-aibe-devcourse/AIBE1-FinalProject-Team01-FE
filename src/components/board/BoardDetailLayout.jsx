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

    // 답글 추가
    function deepCloneComments(comments) {
      return comments.map((comment) => ({
        ...comment,
        replies: comment.replies ? deepCloneComments(comment.replies) : [],
      }));
    }

    function addReplyToCommentIterative(comments, pId, newReply) {
      // 트리 전체 깊은 복사
      const result = deepCloneComments(comments);
      const stack = [];
      for (let i = 0; i < result.length; i++) {
        stack.push(result[i]);
      }
      while (stack.length > 0) {
        const node = stack.pop();
        if (node.id === pId) {
          node.replies = node.replies
            ? [...node.replies, newReply]
            : [newReply];
          break;
        }
        if (node.replies && node.replies.length > 0) {
          for (let j = node.replies.length - 1; j >= 0; j--) {
            stack.push(node.replies[j]);
          }
        }
      }
      return result;
    }

    setComments((prev) => addReplyToCommentIterative(prev, parentId, newReply));
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

  // 댓글 데이터 변환: user → author, authorProfileImg, devcourseName 등으로 매핑
  function mapCommentUserFields(comment) {
    if (!comment.user) return comment;
    return {
      ...comment,
      author: comment.user.nickname,
      authorProfileImg: comment.user.image_url,
      devcourseName: comment.user.devcourse_name,
      authorId: comment.user.id,
      date: comment.created_at
        ? new Date(comment.created_at).toLocaleString()
        : "",
      likes: comment.like_count,
      replies: Array.isArray(comment.replies)
        ? comment.replies.map(mapCommentUserFields)
        : [],
    };
  }

  const mappedComments = comments.map(mapCommentUserFields);

  return (
    <div className="community-detail-container">
      {children}
      <BoardTagShareBar
        tags={post.tags}
        likes={post.like_count}
        bookmarked={bookmarked}
        bookmarkCount={bookmarkCount}
        onBookmarkToggle={handleBookmarkClick}
        postId={post.id}
      />
      <CommentSection
        postId={post.id}
        comments={mappedComments}
        onCommentAdd={handleCommentAdd}
        onReplyAdd={handleReplyAdd}
        onDelete={handleCommentDelete}
        onEdit={handleCommentEdit}
        onLikeToggle={handleCommentLike}
      />
    </div>
  );
};
