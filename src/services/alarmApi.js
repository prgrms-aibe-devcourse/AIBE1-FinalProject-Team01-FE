import { apiClient } from "./api.js";

/**
 * 알람 목록 조회
 * @param {Object} params - 요청 파라미터
 * @param {number} params.page - 페이지 번호 (기본값: 0)
 * @param {number} params.size - 페이지당 크기 (기본값: 10)
 * @param {string} params.sortDirection - 정렬 방법 (ASC, DESC)
 * @param {string} params.field - 정렬 필드
 * @returns {Promise} 알람 목록 응답
 */
export const getAlarms = async (params = {}) => {
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
      `/api/v1/alarms?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 알람 전체 읽기 처리
 * @returns {Promise} 성공 여부
 */
export const markAllAlarmsAsRead = async () => {
  try {
    const response = await apiClient.patch("/api/v1/alarms");
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 알람 단건 읽음 처리
 * @param {string} alarmId - 알람 ID
 * @returns {Promise} 성공 여부
 */
export const markAlarmAsRead = async (alarmId) => {
  try {
    const response = await apiClient.patch(`/api/v1/alarms/${alarmId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
