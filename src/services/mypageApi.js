import apiClient from "./api.js";

/**
 * 마이페이지 관련 API 서비스 (PageResponseDTO 구조에 맞춤)
 */

/**
 * 사용자가 작성한 글 목록 조회
 * @param {Object} params - 쿼리 파라미터
 * @param {number} [params.page=0] - 페이지 번호 (0부터 시작)
 * @param {number} [params.size=10] - 페이지 크기
 * @param {string} [params.sort='createdAt,desc'] - 정렬 방식
 * @returns {Promise<Object>} PageResponseDTO 형태의 응답
 */
export const getMyPosts = async (params = {}) => {
    try {
        const { page = 0, size = 10 } = params;

        const response = await apiClient.get('/api/v1/users/me/posts', {
            params: {
                page,
                size
            }
        });

        return response.data;
    } catch (error) {
        console.error('내 작성글 조회 실패:', error);
        throw error;
    }
};

/**
 * 사용자가 좋아요한 글 목록 조회
 * @param {Object} params - 쿼리 파라미터
 * @param {number} [params.page=0] - 페이지 번호 (0부터 시작)
 * @param {number} [params.size=10] - 페이지 크기
 * @param {string} [params.sort='createdAt,desc'] - 정렬 방식
 * @returns {Promise<Object>} PageResponseDTO 형태의 응답
 */
export const getMyLikedPosts = async (params = {}) => {
    try {
        const { page = 0, size = 10} = params;

        const response = await apiClient.get('/api/v1/users/me/liked', {
            params: {
                page,
                size
            }
        });


        return response.data;
    } catch (error) {
        console.error('좋아요한 글 조회 실패:', error);
        throw error;
    }
};

/**
 * 사용자가 북마크한 글 목록 조회
 * @param {Object} params - 쿼리 파라미터
 * @param {number} [params.page=0] - 페이지 번호 (0부터 시작)
 * @param {number} [params.size=10] - 페이지 크기
 * @param {string} [params.sort='createdAt,desc'] - 정렬 방식
 * @returns {Promise<Object>} PageResponseDTO 형태의 응답
 */
export const getMyBookmarkedPosts = async (params = {}) => {
    try {
        const { page = 0, size = 10} = params;

        const response = await apiClient.get('/api/v1/users/me/bookmarked', {
            params: {
                page,
                size
            }
        });


        return response.data;
    } catch (error) {
        console.error('북마크한 글 조회 실패:', error);
        throw error;
    }
};

export const getMyFollowPosts = async (params = {}) => {
    try {
        const { page = 0, size = 10} = params;

        const response = await apiClient.get('/api/v1/users/me/followPost', {
            params: {
                page,
                size
            }
        });


        return response.data;
    } catch (error) {
        console.error('북마크한 글 조회 실패:', error);
        throw error;
    }
};

/**
 * 개별 API 호출 함수들을 객체로 묶어서 export
 */
export const mypageApi = {
    getMyPosts,
    getMyLikedPosts,
    getMyBookmarkedPosts,
    getMyFollowPosts
};