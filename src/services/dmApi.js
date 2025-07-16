import { apiClient } from "./api.js";

/**
 * 채팅방 목록 조회
 * @returns {Promise<Array>} DM 방 목록
 */
export const getDMRooms = async () => {
  try {
    const response = await apiClient.get("/api/v1/dm/rooms");
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("로그인이 필요합니다.");
    } else if (error.response?.status === 404) {
      throw new Error("채팅방 목록을 찾을 수 없습니다.");
    } else {
      throw new Error("채팅방 목록을 불러오는 중 오류가 발생했습니다.");
    }
  }
};

/**
 * 채팅 기록 조회
 * @param {string} roomId - 방 ID
 * @param {number} userId - 사용자 ID
 * @param {number} page - 페이지 번호 (기본값 0)
 * @param {number} size - 페이지당 크기 (기본값 10)
 * @param {string} sortDirection - 정렬 방법 (ASC/DESC)
 * @returns {Promise<Object>} 메시지 목록과 페이지 정보
 */
export const getDMMessages = async (
  roomId,
  userId,
  page = 0,
  size = 50,
  sortDirection = "ASC"
) => {
  try {
    const params = {
      roomId,
      userId,
      page,
      size,
      sortDirection,
    };

    const response = await apiClient.get("/api/v1/dm/messages", { params });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("로그인이 필요합니다.");
    } else if (error.response?.status === 404) {
      throw new Error("채팅 기록을 찾을 수 없습니다.");
    } else {
      throw new Error("채팅 기록을 불러오는 중 오류가 발생했습니다.");
    }
  }
};

/**
 * 채팅방 생성
 * @param {number} partnerId - 채팅 상대방 사용자 ID
 * @returns {Promise<Object>} 생성된 방 정보
 */
export const createDMRoom = async (partnerId) => {
  try {
    const response = await apiClient.post(`/api/v1/dm/${partnerId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error("잘못된 요청입니다.");
    } else if (error.response?.status === 401) {
      throw new Error("로그인이 필요합니다.");
    } else if (error.response?.status === 404) {
      throw new Error("존재하지 않는 사용자입니다.");
    } else {
      throw new Error("채팅방 생성 중 오류가 발생했습니다.");
    }
  }
};

/**
 * 방 나가기
 * @param {string} roomId - 방 ID
 * @returns {Promise<void>}
 */
export const leaveDMRoom = async (roomId) => {
  try {
    const response = await apiClient.delete(`/api/v1/dm/${roomId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("로그인이 필요합니다.");
    } else if (error.response?.status === 403) {
      throw new Error("방 나가기 권한이 없습니다.");
    } else if (error.response?.status === 404) {
      throw new Error("존재하지 않는 채팅방입니다.");
    } else {
      throw new Error("방 나가기 중 오류가 발생했습니다.");
    }
  }
};

/**
 * 채팅 메시지 검색
 * @param {Object} params - 검색 파라미터 (keyword 필수)
 * @param {string} params.keyword - 검색어
 * @param {number} [params.page=0] - 페이지 번호
 * @param {number} [params.size=10] - 페이지당 크기
 * @param {string} [params.sortDirection] - 정렬 방법 (ASC/DESC)
 * @param {string} [params.field] - 정렬 필드
 * @returns {Promise<Object>} 검색 결과(메시지 목록, 페이지 정보)
 */
export const getDMMessageSearch = async (params) => {
  try {
    const { keyword, page = 0, size = 10, sortDirection, field } = params;
    if (!keyword || !keyword.trim()) {
      throw new Error("검색어를 입력해주세요.");
    }
    const queryParams = new URLSearchParams();
    queryParams.append("keyword", keyword);
    queryParams.append("page", page.toString());
    queryParams.append("size", size.toString());
    if (sortDirection) queryParams.append("sortDirection", sortDirection);
    if (field) queryParams.append("field", field);
    const response = await apiClient.get(
      `/api/v1/dm/messages/search?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("로그인이 필요합니다.");
    } else if (error.response?.status === 404) {
      throw new Error("검색 결과가 없습니다.");
    } else {
      throw new Error("메시지 검색 중 오류가 발생했습니다.");
    }
  }
};
