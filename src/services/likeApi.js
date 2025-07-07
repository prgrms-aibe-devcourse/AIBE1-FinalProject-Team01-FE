import apiClient from "./api";

const LIKE_BASE_URL = "/api/v1/";

export const addlikePost = async (postId) => {
  try {
    const response = await apiClient.post(`${LIKE_BASE_URL}/posts/${postId}/likes`);
    return response.data;
  } catch (error) {
    console.error("❌ 게시글 좋아요 추가 실패:", error);
    throw error;
  }
};

export const removelikePost = async (postId) => {
  try {
    await apiClient.delete(`${LIKE_BASE_URL}/posts/${postId}/likes`);
  } catch (error) {
    console.error("❌ 게시글 좋아요 해제 실패:", error);
    throw error;
  }
};

export const addlikeComment = async (postId, commentId) => {
  try {
    const response = await apiClient.post(`${LIKE_BASE_URL}/posts/${postId}/comments/${commentId}/likes`);
    return response.data;
  } catch (error) {
    console.error("❌ 댓글 좋아요 추가 실패:", error);
    throw error;
  }
};

export const removelikeComment = async (postId, commentId) => {
  try {
    await apiClient.delete(`${LIKE_BASE_URL}/posts/${postId}/comments/${commentId}/likes`);
  } catch (error) {
    console.error("❌ 댓글 좋아요 해제 실패:", error);
    throw error;
  }
};
