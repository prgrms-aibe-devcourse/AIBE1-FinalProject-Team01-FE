// 토큰 관리 전용 유틸리티
const COOKIE_DOMAIN = import.meta.env.VITE_COOKIE_DOMAIN || "localhost";
const DEV_TOKEN = import.meta.env.VITE_DEV_JWT_TOKEN || "dev_dummy_token";

class TokenManager {
  // 쿠키에서 특정 토큰 가져오기
  getCookie(name) {
    const cookies = document.cookie.split(";");
    const cookie = cookies.find((cookie) =>
      cookie.trim().startsWith(`${name}=`)
    );
    return cookie ? cookie.split("=")[1] : null;
  }

  // Access Token 조회
  getAccessToken() {
    return this.getCookie("accessToken");
  }

  // Refresh Token 조회
  getRefreshToken() {
    return this.getCookie("refreshToken");
  }

  // 토큰 유효성 검증
  isTokenValid(token) {
    if (!token) return false;

    // 개발용 토큰은 항상 유효
    if (token === "dev_dummy_token" || token === DEV_TOKEN) {
      return true;
    }

    try {
      // JWT 토큰 구조 확인
      const parts = token.split(".");
      if (parts.length !== 3) return false;

      // payload 디코딩
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Date.now() / 1000;

      // 만료 시간 확인
      return payload.exp && payload.exp > currentTime;
    } catch (error) {
      console.warn("토큰 유효성 검증 실패:", error);
      return false;
    }
  }

  // Access Token 유효성 확인
  isAccessTokenValid() {
    const token = this.getAccessToken();
    return this.isTokenValid(token);
  }

  // 모든 토큰 제거
  removeAllTokens() {
    const expireDate = "Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = `accessToken=; expires=${expireDate}; path=/; domain=${COOKIE_DOMAIN}`;
    document.cookie = `refreshToken=; expires=${expireDate}; path=/; domain=${COOKIE_DOMAIN}`;
  }

  // 로그인 상태 확인 (간단 버전)
  isLoggedIn() {
    const accessToken = this.getAccessToken();
    return this.isTokenValid(accessToken);
  }

  // 개발 환경 체크
  isDevelopment() {
    return import.meta.env.MODE === "development";
  }
}

// 싱글톤 인스턴스 생성
const tokenManager = new TokenManager();

export default tokenManager;
