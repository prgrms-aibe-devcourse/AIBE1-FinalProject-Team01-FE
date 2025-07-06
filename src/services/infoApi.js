import { apiClient } from "./api.js";

/**
 * Info 게시글 목록 조회
 * @param {string} boardType - 게시판 타입 (REVIEW, NEWS 등)
 * @param {Object} params - 요청 파라미터
 * @param {number} params.page - 페이지 번호 (기본값: 0)
 * @param {number} params.size - 페이지당 크기 (기본값: 10)
 * @param {string} params.sortDirection - 정렬 방법 (ASC, DESC)
 * @param {string} params.field - 정렬 필드
 * @param {string} params.keyword - 검색어
 * @returns {Promise} Info 게시글 목록 응답
 */

const transformInfoPostData = (apiData) => {
    if (!apiData) return null;

    return {
        ...apiData,
        // 사용자 정보 변환
        devcourseName: apiData.devCourseTrack || apiData.devcourseName,
        devcourseBatch: apiData.devCourseBatch || apiData.devcourseBatch,

        // 태그 배열로 변환 (문자열 -> 배열)
        tags: apiData.tags
            ? (typeof apiData.tags === 'string'
                ? apiData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                : apiData.tags)
            : [],

        // 좋아요/북마크 필드명 통일
        isLiked: apiData.hasLiked !== undefined ? apiData.hasLiked : apiData.isLiked,
        isBookmarked: apiData.hasBookmarked !== undefined ? apiData.hasBookmarked : apiData.isBookmarked,

        // 사용자 객체 생성 (기존 코드와의 호환성을 위해)
        user: {
            id: apiData.userId,
            nickname: apiData.nickname,
            profileImageUrl: apiData.profileImageUrl,
            devcourseName: apiData.devCourseTrack || apiData.devcourseName,
            devcourseBatch: apiData.devCourseBatch || apiData.devcourseBatch,
        }
    };
};

export const getInfoPosts = async (boardType, params = {}) => {
    try {
        const {
            page = 0,
            size = 10,
            sortDirection = "DESC",
            field = "POST_LATEST",
            keyword
        } = params;

        const queryParams = new URLSearchParams();
        queryParams.append("page", page.toString());
        queryParams.append("size", size.toString());
        queryParams.append("sortDirection", sortDirection);
        queryParams.append("field", field);

        if (keyword) {
            queryParams.append("keyword", keyword);
        }

        const response = await apiClient.get(
            `/api/v1/IT/${boardType}?${queryParams.toString()}`
        );

        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            throw error;
        } else if (error.response?.status === 404) {
            throw new Error("존재하지 않는 게시판입니다.");
        } else {
            throw new Error("게시글 목록을 불러오는 중 오류가 발생했습니다.");
        }
    }
};

/**
 * Info 게시글 상세 조회
 * @param {string} boardType - 게시판 타입
 * @param {number} itID - 게시글 ID
 * @returns {Promise} 게시글 상세 정보
 */
export const getInfoPost = async (boardType, itID) => {
    try {
        const response = await apiClient.get(`/api/v1/IT/${boardType}/${itID}`);

        return transformInfoPostData(response.data);
    } catch (error) {
        if (error.response?.status === 404) {
            throw new Error("존재하지 않는 게시글입니다.");
        } else {
            throw new Error("게시글을 불러오는 중 오류가 발생했습니다.");
        }
    }
};

/**
 * Info 게시글 작성 (REVIEW만 가능)
 * @param {Object} postData - 게시글 데이터
 * @param {string} postData.boardType - 게시판 타입
 * @param {string} postData.title - 제목
 * @param {string} postData.content - 내용
 * @param {Array} postData.tags - 태그 목록
 * @returns {Promise} 작성된 게시글 정보
 */
export const createInfoPost = async (postData) => {
    try {
        const response = await apiClient.post(`/api/v1/IT/${postData.boardType}`, postData);
        console.log(response);
        return response.data;
    } catch (error) {
        if (error.response?.status === 400) {
            throw new Error("입력 정보를 확인해주세요.");
        } else if (error.response?.status === 401) {
            throw new Error("로그인이 필요합니다.");
        } else if (error.response?.status === 403) {
            throw new Error("작성 권한이 없습니다.");
        } else {
            throw new Error("게시글 작성 중 오류가 발생했습니다.");
        }
    }
};

/**
 * Info 게시글 수정 (REVIEW만 가능)
 * @param {string} boardType - 게시판 타입
 * @param {number} postId - 게시글 ID
 * @param {Object} postData - 수정할 게시글 데이터
 * @returns {Promise} 수정된 게시글 정보
 */
export const updateInfoPost = async (boardType, postId, postData) => {
    try {
        const response = await apiClient.put(`/api/v1/IT/${boardType}/${postId}`, postData);

        return response.data;
    } catch (error) {
        console.error(`❌ Info 게시글 수정 실패 (${boardType}/${postId}):`, error);

        if (error.response?.status === 403) {
            throw new Error("수정 권한이 없습니다.");
        } else if (error.response?.status === 404) {
            throw new Error("존재하지 않는 게시글입니다.");
        } else {
            throw new Error("게시글 수정 중 오류가 발생했습니다.");
        }
    }
};

/**
 * Info 게시글 삭제 (REVIEW만 가능)
 * @param {string} boardType - 게시판 타입
 * @param {number} postId - 게시글 ID
 * @returns {Promise} 삭제 결과
 */
export const deleteInfoPost = async (boardType, postId) => {
    try {
        const response = await apiClient.delete(`/api/v1/info/${boardType}/${postId}`);

        return response.data;
    } catch (error) {
        alert("에러가 발생하였습니다. 다시 시도해주세요.");

        if (error.response?.status === 403) {
            throw new Error("삭제 권한이 없습니다.");
        } else if (error.response?.status === 404) {
            throw new Error("존재하지 않는 게시글입니다.");
        } else {
            throw new Error("게시글 삭제 중 오류가 발생했습니다.");
        }
    }
};
