import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function createCommentObject(content, user, postId, parentCommentId = null) {
  return {
    id: Date.now() + Math.random(), // 임시 ID
    postId,
    nickname: user?.nickname || "익명",
    profileImageUrl: user?.image_url || "https://via.placeholder.com/40",
    parentCommentId,
    content,
    replyCount: 0,
    likeCount: 0,
    hasLiked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    setComments((prev) => [...prev, newReply]);
  };

  const handleCommentEdit = (commentId, content) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, content, updatedAt: new Date().toISOString() }
          : comment
      )
    );
  };

  const handleCommentDelete = (commentId) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
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
