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
    if (error.response?.status === 400) {
      return {
        available: false,
        message: error.response.data.message || "이미 사용 중인 닉네임입니다.",
      };
    }

    throw new Error("닉네임 중복확인 중 오류가 발생했습니다");
  }
};

export const signupUser = async (userData) => {
  try {
    const response = await apiClient.post("/api/v1/auth/signup", {
      email: userData.email,
      password: userData.password,
      nickname: userData.nickname,
      name: userData.name,
      topics: userData.topics,
    });

    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error("회원가입 중 오류가 발생했습니다.");
  }
};

export const logoutUser = async () => {
  try {
    const response = await apiClient.post("/api/v1/auth/logout", {});
    return response.data;
  } catch (error) {
    throw new Error("로그아웃 중 오류가 발생했습니다.");
  }
};
