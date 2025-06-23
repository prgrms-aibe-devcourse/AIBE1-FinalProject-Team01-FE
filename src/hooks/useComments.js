import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function createCommentObject(content, user, postId, parentId = null) {
  const authorInfo = user
    ? {
        id: user.id,
        nickname: user.nickname,
        image_url: user.image_url || "https://via.placeholder.com/40",
        devcourse_name: user.devcourse_name,
      }
    : {
        id: -1, // 비로그인 유저 ID
        nickname: "익명",
        image_url: "https://via.placeholder.com/40",
        devcourse_name: null,
      };

  return {
    id: Date.now() + Math.random(), // 임시 ID
    user_id: authorInfo.id,
    post_id: postId,
    parent_comment_id: parentId,
    content,
    like_count: 0,
    is_deleted: false,
    is_liked: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: authorInfo,
    replies: [],
  };
}

export const useComments = (initialComments = [], postId) => {
  const [comments, setComments] = useState(initialComments);
  const { user } = useAuth();

  const handleCommentAdd = (content) => {
    const newComment = createCommentObject(content, user, postId);
    setComments((prev) => [newComment, ...prev]);
  };

  const handleReplyAdd = (parentId, content) => {
    const newReply = createCommentObject(content, user, postId, parentId);
    const addReplyIterative = (comments, pId, reply) => {
      return comments.map((comment) => {
        if (comment.id === pId) {
          return { ...comment, replies: [...(comment.replies || []), reply] };
        }
        if (comment.replies?.length > 0) {
          return {
            ...comment,
            replies: addReplyIterative(comment.replies, pId, reply),
          };
        }
        return comment;
      });
    };
    setComments((prev) => addReplyIterative(prev, parentId, newReply));
  };

  const handleCommentEdit = (commentId, content) => {
    const editCommentRecursive = (comments, id, newContent) => {
      return comments.map((comment) => {
        if (comment.id === id) {
          return {
            ...comment,
            content: newContent,
            updated_at: new Date().toISOString(),
          };
        }
        if (comment.replies?.length > 0) {
          return {
            ...comment,
            replies: editCommentRecursive(comment.replies, id, newContent),
          };
        }
        return comment;
      });
    };
    setComments((prev) => editCommentRecursive(prev, commentId, content));
  };

  const handleCommentDelete = (commentId) => {
    const deleteCommentRecursive = (comments, id) => {
      const newComments = comments.filter((c) => c.id !== id);
      if (newComments.length === comments.length) {
        return newComments.map((c) => {
          if (c.replies?.length > 0) {
            return { ...c, replies: deleteCommentRecursive(c.replies, id) };
          }
          return c;
        });
      }
      return newComments;
    };
    setComments((prev) => deleteCommentRecursive(prev, commentId));
  };

  return {
    comments,
    setComments,
    handleCommentAdd,
    handleReplyAdd,
    handleCommentEdit,
    handleCommentDelete,
  };
};
