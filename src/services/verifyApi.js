import { apiClient } from "./api.js";

/**
 * 수강생 인증 요청
 * @param {Object} formData - 인증 요청 데이터
 * @param {string} formData.devcourseName - 과정명
 * @param {string} formData.devcourseBatch - 기수
 * @param {File} formData.image - 인증용 이미지 파일
 * @returns {Promise<Object>} 인증 결과
 */
export const requestVerification = async (formData) => {
  try {
    const data = new FormData();
    data.append("devcourseName", formData.devcourseName);
    data.append("devcourseBatch", formData.devcourseBatch);
    data.append("image", formData.image);

    const response = await apiClient.post("/api/v1/verify/request", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    let errorMessage = "인증 요청에 실패했습니다.";

    if (error.response?.status === 400) {
      errorMessage = "입력 정보를 확인해주세요.";
    } else if (error.response?.status === 409) {
      errorMessage = "이미 인증 신청이 진행 중입니다.";
    } else if (error.response?.status === 403) {
      errorMessage = "인증 권한이 없습니다.";
    } else if (error.response?.status === 413) {
      errorMessage = "파일 크기가 너무 큽니다. 5MB 이하의 파일을 선택해주세요.";
    } else if (error.response?.status >= 500) {
      errorMessage = "서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
    } else if (!error.response) {
      errorMessage = "네트워크 연결을 확인해주세요.";
    }

    throw new Error(errorMessage);
  }
};

/**
 * 인증 상태 조회
 * @returns {Promise<Object>} 인증 상태 정보
 */
export const getVerificationStatus = async () => {
  try {
    const response = await apiClient.get("/api/v1/verify/status");
    return response.data;
  } catch (error) {
    let errorMessage = "인증 상태 조회에 실패했습니다.";

    if (error.response?.status >= 500) {
      errorMessage = "서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
    } else if (!error.response) {
      errorMessage = "네트워크 연결을 확인해주세요.";
    }

    throw new Error(errorMessage);
  }
}; 