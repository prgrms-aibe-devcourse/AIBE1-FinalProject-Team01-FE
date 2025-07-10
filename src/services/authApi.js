import apiClient from "./api.js";

export const checkEmailDuplicate = async (email) => {
  try {
    const response = await apiClient.get(
      `/api/v1/auth/check/email?email=${email}`
    );

    return {
      available: response.data.available,
      message: response.data.message,
    };
  } catch (error) {
    console.error("이메일 중복확인 API 에러: ", error);

    if (error.response?.status === 400) {
      return {
        available: false,
        message: error.response.data.message || "이미 사용 중인 이메일입니다.",
      };
    }

    throw new Error("이메일 중복확인 중 오류가 발생했습니다");
  }
};

export const checkNicknameDuplicate = async (nickname) => {
  try {
    const response = await apiClient.get(
      `/api/v1/auth/check/nickname?nickname=${nickname}`
    );

    return {
      available: response.data.available,
      message: response.data.message,
    };
  } catch (error) {
    console.error("닉네임 중복확인 API 에러: ", error);

    if (error.response?.status === 400) {
      return {
        available: false,
        message: error.response.data.message || "이미 사용 중인 닉네임입니다.",
      };
    }

    throw new Error("닉네임 중복확인 중 오류가 발생했습니다");
  }
};
