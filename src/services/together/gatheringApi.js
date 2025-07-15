import apiClient from "../api.js";

const GATHERING_BASE_URL = "/api/v1/gatherings";

export const getGatheringPostList = async (params = {}) => {
    try {
        const { page = 0, size = 10, sortDirection, field, keyword  } = params;

        const queryParams = new URLSearchParams();
        queryParams.append("page", page.toString());
        queryParams.append("size", size.toString());

        if (sortDirection) {
            queryParams.append("sortDirection", sortDirection);
        }
        if (field) {
            queryParams.append("field", field);
        }
        if (keyword && keyword.trim()) {
            queryParams.append("keyword", keyword.trim());
        }

        const response = await apiClient.get(`${GATHERING_BASE_URL}?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        console.error("❌ 모임 게시글 목록 조회 실패:", error);
        throw error;
    }
}

export const getGatheringPostDetail = async (gatheringId) => {
    try {
        const response = await apiClient.get(`${GATHERING_BASE_URL}/${gatheringId}`);
        return response.data;
    } catch (error) {
        console.error("❌ 모임 게시글 상세 조회 실패:", error);
        throw error;
    }
}

export const createGatheringPost = async (gatheringData) => {
    try {
        const response = await apiClient.post(GATHERING_BASE_URL, gatheringData);
        return response.data;
    } catch (error) {
        console.error("❌ 모임 게시글 생성 실패:", error);
        throw error;
    }
}

export const updateGatheringPost = async (gatheringId, gatheringData) => {
    try {
        await apiClient.put(`${GATHERING_BASE_URL}/${gatheringId}`, gatheringData);
    } catch (error) {
        console.error("❌ 모임 게시글 수정 실패:", error);
        throw error;
    }
}

export const updateGatheringStatus = async (gatheringId, status) => {
    try {
        await apiClient.put(`${GATHERING_BASE_URL}/${gatheringId}/${status}`);
    } catch (error) {
        console.error("❌ 모임 게시글 상태 업데이트 실패:", error);
        throw error;
    }
}

export const deleteGatheringPost = async (gatheringId) => {
    try {
        await apiClient.delete(`${GATHERING_BASE_URL}/${gatheringId}`);
    } catch (error) {
        console.error("❌ 모임 게시글 삭제 실패:", error);
        throw error;
    }
}
