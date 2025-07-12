import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../services/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
        topics: response.data.topics,
        providerType: response.data.providerType
      });
    } catch (error) {
      console.log("사용자 정보 조회 실패 - 로그아웃 상태");
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 🆕 사용자 정보 새로고침 함수 추가
  const refreshUserInfo = async () => {
    try {
      const response = await apiClient.get("/api/v1/users/me");

      const updatedUser = {
        id: response.data.userId,
        name: response.data.name,
        email: response.data.email,
        avatar: response.data.imageUrl || "/assets/user-icon.png",
        nickname: response.data.nickname,
        devcourseTrack: response.data.devcourseName,
        devcourseBatch: response.data.devcourseBatch,
        topics: response.data.topics,
        providerType: response.data.providerType
      };

      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("사용자 정보 새로고침 실패:", error);
      throw error;
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setIsLoggedIn(true);
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
      <AuthContext.Provider value={{
        isLoggedIn,
        login,
        logout,
        user,
        loading,
        refreshUserInfo
      }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);