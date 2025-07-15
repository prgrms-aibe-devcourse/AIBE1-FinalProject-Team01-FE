import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../services/api.js";
import { logoutUser } from "../services/authApi.js";
import masseukiImg from "../assets/masseuki.png";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const mapUserData = (responseData) => ({
    id: responseData.userId,
    name: responseData.name,
    email: responseData.email,
    avatar: responseData.imageUrl || masseukiImg,
    nickname: responseData.nickname,
    devcourseTrack: responseData.devcourseName,
    devcourseBatch: responseData.devcourseBatch,
    topics: responseData.topics,
    providerType: responseData.providerType,
  });

  const fetchUserInfo = async () => {
    const response = await apiClient.get("/api/v1/users/me");
    return mapUserData(response.data);
  };

  const initializeAuth = async () => {
    try {
      const userData = await fetchUserInfo();
      setIsLoggedIn(true);
      setUser(userData);
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 🆕 사용자 정보 새로고침 함수 추가
  const refreshUserInfo = async () => {
    try {
      const userData = await fetchUserInfo();

      setUser(userData);
      setIsLoggedIn(true);
      return userData;
    } catch (error) {
      console.error("사용자 정보 새로고침 실패:", error);
      throw error;
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setLoading(false);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // 실패해도 계속 진행
    }

    setUser(null);
    setIsLoggedIn(false);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        user,
        loading,
        refreshUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
