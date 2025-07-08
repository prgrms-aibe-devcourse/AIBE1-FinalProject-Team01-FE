import { apiClient } from './api.js';

/**
 * 댓글 API 서비스
 */
export const commentApi = {
    /**
     * 댓글 목록 조회 (부모 댓글만, 커서 기반 페이지네이션)
     */
    getComments: async (postId, cursor = null, size = 10) => {
        try {
            const params = new URLSearchParams({ size: size.toString() });
            if (cursor) {
                params.append('cursor', cursor.toString());
            }

            const response = await apiClient.get(`/api/v1/posts/${postId}/comments?${params}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * 대댓글 목록 조회
     */
    getReplies: async (postId, commentId, cursor = null, size = 5) => {
        try {
            const params = new URLSearchParams({ size: size.toString() });
            if (cursor) {
                params.append('cursor', cursor.toString());
            }

            const response = await apiClient.get(`/api/v1/posts/${postId}/comments/${commentId}/replies?${params}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * 댓글 작성
     */
    createComment: async (postId, commentData) => {
        try {
            const response = await apiClient.post(`/api/v1/posts/${postId}/comments`, commentData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * 댓글 수정
     */
    updateComment: async (postId, commentId, commentData) => {
        try {
            const response = await apiClient.put(`/api/v1/posts/${postId}/comments/${commentId}`, commentData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * 댓글 삭제
     */
    deleteComment: async (postId, commentId) => {
        try {
            const response = await apiClient.delete(`/api/v1/posts/${postId}/comments/${commentId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};