import axios from "axios";

// 기본 API 설정
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// JWT 토큰 관리
const TOKEN_KEY = "amateurs_token";

// 토큰 관리자 객체
const tokenManager = {
  // 토큰 저장
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // 토큰 조회
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // 토큰 제거
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  // 토큰 유효성 검사 (간단한 형태)
  isTokenValid: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;

    // 개발용 더미 토큰이거나 .env의 토큰인 경우 항상 유효하다고 처리
    const devToken = import.meta.env.VITE_DEV_JWT_TOKEN || "dev_dummy_token";
    if (token === "dev_dummy_token" || token === devToken) return true;

    try {
      // JWT 토큰 구조 확인 (실제로는 만료 시간도 체크해야 함)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      console.warn("토큰 검증 실패:", error);
      return false;
    }
  },
};

// 명시적으로 export
export { tokenManager };

// 요청 인터셉터 - JWT 토큰 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 401 에러 처리
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 토큰이 만료되었거나 유효하지 않음
      tokenManager.removeToken();
      // 개발 모드에서는 자동 리다이렉트 하지 않음
      console.warn("인증 토큰이 만료되었습니다.");
      // window.location.href = "/login"; // 주석 처리
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// 로그인 API
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post("/api/v1/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });
    return response.data;
  } catch (error) {
    // 에러 메시지 처리
    const errorMessage =
      error.response?.data?.message || "로그인에 실패했습니다.";
    throw new Error(errorMessage);
  }
};
