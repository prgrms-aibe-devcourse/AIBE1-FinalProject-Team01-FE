import { apiClient } from "./api.js";

/**
 * 신고 제출
 * @param {Object} reportData - 신고 데이터
 * @param {number} reportData.targetId - 신고 대상 ID
 * @param {string} reportData.reportTarget - 신고 대상 타입 ('POST' | 'COMMENT')
 * @param {string} reportData.reportType - 신고 사유 타입
 * @param {string} reportData.description - 신고 내용
 * @returns {Promise} 신고 제출 응답
 */
export const submitReport = async (reportData) => {
    try {
        const response = await apiClient.post("/api/v1/reports", reportData);

        return response.data;
    } catch (error) {
        console.error("❌ 신고 제출 실패:", error);

        // 에러 메시지 처리
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else if (error.response?.status === 400) {
            throw new Error("잘못된 신고 요청입니다.");
        } else if (error.response?.status === 401) {
            throw new Error("로그인이 필요합니다.");
        } else if (error.response?.status === 403) {
            throw new Error("신고 권한이 없습니다.");
        } else if (error.response?.status === 404) {
            throw new Error("신고 대상을 찾을 수 없습니다.");
        } else if (error.response?.status === 429) {
            throw new Error("신고 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
        } else {
            throw new Error("신고 처리 중 오류가 발생했습니다.");
        }
    }
};

/**
 * 내 신고 목록 조회 (관리자 또는 본인용)
 * @param {Object} params - 요청 파라미터
 * @param {number} params.page - 페이지 번호 (기본값: 0)
 * @param {number} params.size - 페이지당 크기 (기본값: 10)
 * @param {string} params.sortDirection - 정렬 방법 (ASC, DESC)
 * @param {string} params.field - 정렬 필드
 * @returns {Promise} 신고 목록 응답
 */
export const getMyReports = async (params = {}) => {
    try {
        const { page = 0, size = 10, sortDirection, field } = params;

        const queryParams = new URLSearchParams();
        queryParams.append("page", page.toString());
        queryParams.append("size", size.toString());

        if (sortDirection) {
            queryParams.append("sortDirection", sortDirection);
        }
        if (field) {
            queryParams.append("field", field);
        }

        const response = await apiClient.get(
            `/api/v1/reports/my?${queryParams.toString()}`
        );
        return response.data;
    } catch (error) {
        console.error("❌ 내 신고 목록 조회 실패:", error);
        throw error;
    }
};

/**
 * 신고 상세 조회
 * @param {number} reportId - 신고 ID
 * @returns {Promise} 신고 상세 정보
 */
export const getReportDetail = async (reportId) => {
    try {
        const response = await apiClient.get(`/api/v1/reports/${reportId}`);
        return response.data;
    } catch (error) {
        console.error("❌ 신고 상세 조회 실패:", error);
        throw error;
    }
};

/**
 * 신고 취소 (본인 신고만 가능)
 * @param {number} reportId - 신고 ID
 * @returns {Promise} 취소 결과
 */
export const cancelReport = async (reportId) => {
    try {
        const response = await apiClient.delete(`/api/v1/reports/${reportId}`);
        return response.data;
    } catch (error) {
        console.error("❌ 신고 취소 실패:", error);

        if (error.response?.status === 400) {
            throw new Error("이미 처리된 신고는 취소할 수 없습니다.");
        } else if (error.response?.status === 403) {
            throw new Error("본인이 작성한 신고만 취소할 수 있습니다.");
        } else {
            throw new Error("신고 취소 중 오류가 발생했습니다.");
        }
    }
};