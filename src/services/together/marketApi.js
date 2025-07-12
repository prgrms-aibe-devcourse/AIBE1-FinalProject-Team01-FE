import apiClient from "../api.js";

const MARKET_BASE_URL = "/api/v1/market";

export const getMarketPostList = async (params = {}) => {
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

    const response = await apiClient.get(`${MARKET_BASE_URL}?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error("❌ 마켓 게시글 목록 조회 실패:", error);
    throw error;
  }
}

export const getMarketPostDetail = async (marketId) => {
  try {
    const response = await apiClient.get(`${MARKET_BASE_URL}/${marketId}`);
    return response.data;
  } catch (error) {
    console.error("❌ 마켓 게시글 상세 조회 실패:", error);
    throw error;
  }
}

export const createMarketPost = async (marketData) => {
  try {
    const response = await apiClient.post(MARKET_BASE_URL, marketData);
    return response.data;
  } catch (error) {
    console.error("❌ 마켓 게시글 생성 실패:", error);
    throw error;
  }
}

export const updateMarketPost = async (marketId, marketData) => {
  try {
    await apiClient.put(`${MARKET_BASE_URL}/${marketId}`, marketData);
  } catch (error) {
    console.error("❌ 마켓 게시글 수정 실패:", error);
    throw error;
  }
}

export const deleteMarketPost = async (marketId) => {
  try {
    await apiClient.delete(`${MARKET_BASE_URL}/${marketId}`);
  } catch (error) {
    console.error("❌ 마켓 게시글 삭제 실패:", error);
    throw error;
  }
}
