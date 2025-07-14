import apiClient from "../api.js";

const MATCHING_BASE_URL = "/api/v1/matches";

export const getMatchingPostList = async (params = {}) => {
  try {
    const { page = 0, size = 10, sortDirection, field, keyword } = params;

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

    const response = await apiClient.get(`${MATCHING_BASE_URL}?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error("❌ 매칭 게시글 목록 조회 실패:", error);
    throw error;
  }
}

export const getMatchingPostDetail = async (matchingId) => {
  try {
    const response = await apiClient.get(`${MATCHING_BASE_URL}/${matchingId}`);
    return response.data;
  } catch (error) {
    console.error("❌ 매칭 게시글 상세 조회 실패:", error);
    throw error;
  }
}

export const createMatchingPost = async (matchingData) => {
  try {
    const response = await apiClient.post(MATCHING_BASE_URL, matchingData);
    return response.data;
  } catch (error) {
    console.error("❌ 매칭 게시글 생성 실패:", error);
    throw error;
  }
}

export const updateMatchingPost = async (matchingId, matchingData) => {
  try {
    await apiClient.put(`${MATCHING_BASE_URL}/${matchingId}`, matchingData);
  } catch (error) {
    console.error("❌ 매칭 게시글 수정 실패:", error);
    throw error;
  }
}

export const deleteMatchingPost = async (matchingId) => {
  try {
    await apiClient.delete(`${MATCHING_BASE_URL}/${matchingId}`);
  } catch (error) {
    console.error("❌ 매칭 게시글 삭제 실패:", error);
    throw error;
  }
}
