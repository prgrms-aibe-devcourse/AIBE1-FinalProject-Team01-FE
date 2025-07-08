import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../services/api.js";

// Context 생성 - 정의 - 커스텀 훅
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 쿠키 읽기는 포기하고 API로 직접 확인
        const response = await apiClient.get("/api/v1/users/me");

        // API 성공 시 로그인 상태 설정
        setIsLoggedIn(true);
        setUser({
          id: response.data.userId,
          name: response.data.name,
          email: response.data.email,
          avatar: response.data.imageUrl || "/assets/user-icon.png",
          nickname: response.data.nickname,
        });
      } catch (error) {
        // API 실패 시 로그아웃 상태
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
