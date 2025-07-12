import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../services/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await apiClient.get("/api/v1/users/me");

        setIsLoggedIn(true);
        setUser({
          id: response.data.userId,
          name: response.data.name,
          email: response.data.email,
          avatar: response.data.imageUrl || "/assets/user-icon.png",
          nickname: response.data.nickname,
          devcourseTrack: response.data.devcourseName,
          devcourseBatch: response.data.devcourseBatch,
        });
      } catch (error) {
        if (error.response?.status === 401) {
        } else {
          console.error("예상치 못한 인증 에러:", error);
        }
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []); // 빈 의존성 배열로 한 번만 실행

  const login = (userData, token) => {
    setUser(userData);
    setIsLoggedIn(true);
    // 로그인 즉시 로딩 상태 해제
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    // 로그아웃 API도 호출해야 할 수 있음
  };

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
