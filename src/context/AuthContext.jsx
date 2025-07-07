import { createContext, useContext, useState, useEffect } from "react";
import apiClient, { tokenManager } from "../services/api.js";

// Context 생성 - 정의 - 커스텀 훅
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 초기 로드 시 토큰 확인
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = tokenManager.getToken();
        if (token && tokenManager.isTokenValid()) {
          // 토큰이 유효하면 로그인 상태로 설정
          // 실제로는 토큰으로 사용자 정보를 가져와야 함
          setIsLoggedIn(true);
          // TODO: 토큰으로 사용자 정보 조회 API 호출
        } else {
          // 토큰이 없거나 만료되었으면 제거
          tokenManager.removeToken();
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error("인증 초기화 실패:", error);
        tokenManager.removeToken();
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // userData: { name, email, ... } + token
  const login = (userData, token) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    // JWT 토큰 제거
    tokenManager.removeToken();
  };

  // 로딩 중에는 로딩 표시
  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
