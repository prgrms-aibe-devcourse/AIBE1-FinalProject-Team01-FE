import { apiClient } from "./api";

export const getPosts = async (params) => {
    try {
        const response = await apiClient.get(`/api/v1/projects`, { params });
        console.log(`목록 조회 성공: `, response.data);
        return response.data;
    } catch (error) {
        console.error(`프로젝트 허브 목록 조회 요청 실패: `, error);
        throw error;
    }
};

export const getPostById = async (projectId) => {
    try {
        const response = await apiClient.get(`/api/v1/projects/${projectId}`);
        return response.data;
    } catch (error) {
        console.error(`프로젝트 허브 상세 조회 요청 실패: `, error);
        throw error;
    }
};