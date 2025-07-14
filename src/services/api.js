import axios from "axios";
import { reissueToken } from "./authApi.js";

// 기본 API 설정
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const redirectToLogin = () => {
  const currentPath = window.location.pathname;

  if (
    currentPath === "/" ||
    currentPath === "/login" ||
    currentPath === "/signup"
  ) {
    return;
  }

  const currentUrl = window.location.pathname + window.location.search;
  const encodedRedirectUrl = encodeURIComponent(currentUrl);
  window.location.href = `/login?redirectUrl=${encodedRedirectUrl}`;
};

// 응답 인터셉터 - 401 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (error.config.url.includes("/auth/reissue")) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        await reissueToken();

        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        redirectToLogin();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 401) {
      const excludeUrls = [
        "/api/v1/community/",
        "/api/v1/like",
        "/api/v1/bookmark",
        "/api/v1/comment",
        "/api/v1/report",
        "/api/v1/dm",
        "/api/v1/alarm",
      ];

      const shouldExclude = excludeUrls.some((url) =>
        error.config.url.includes(url)
      );

      if (shouldExclude) {
        console.log("🚫 권한 부족");
        return Promise.reject(error);
      }

      console.log("🔐 인증 만료");
      redirectToLogin();
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
    // HTTP 상태 코드에 따른 안전한 에러 메시지
    let errorMessage =
      "이메일 또는 비밀번호가 올바르지 않습니다. 다시 시도해주세요.";

    if (error.response?.status >= 500) {
      errorMessage =
        "서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
    } else if (!error.response) {
      errorMessage = "네트워크 연결을 확인해주세요.";
    }

    throw new Error(errorMessage);
  }
};
