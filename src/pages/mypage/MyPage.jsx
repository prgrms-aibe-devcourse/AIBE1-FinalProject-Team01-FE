import React, { useState, useEffect } from "react";
import { NavigationBar } from "../../components/common/NavigationBar";
import { FooterBar } from "../../components/common/FooterBar";
import { ProfileSummary } from "../../components/mypage/ProfileSummary";
import { PostList } from "../../components/mypage/PostList";
import { MyPageSidebar } from "../../components/mypage/MyPageSidebar";
import { EditProfileForm } from "../../components/mypage/EditProfileForm";
import { useAuth } from "../../context/AuthContext";
import WithdrawPage from "../../components/mypage/WithdrawPage.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPostDetailUrl } from "../../utils/board";
import ChangePasswordPage from "../../components/mypage/ChangePasswordPage.jsx";
import { StudentVerificationForm } from "../../components/mypage/StudentVerificationForm";

/**
 * 마이페이지 메인 (쿼리 파라미터 기반 라우팅)
 * URL 예시: /mypage?tab=posts&page=2
 */
const TAB_LIST = [
  { key: "posts", label: "작성글" },
  { key: "likes", label: "좋아요" },
  { key: "bookmarks", label: "북마크" },
];

export default function MyPage() {
  const [editMode, setEditMode] = useState(false);
  const [verificationMode, setVerificationMode] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isLoggedIn, refreshUserInfo } = useAuth();
  const [cachedProfileData, setCachedProfileData] = useState(null);

  const profileData = {
    name: user.name || "사용자",
    email: user.email || "",
    imageUrl: user.avatar || "/assets/user-icon.png",
    nickname: user.nickname || "",
    devcourseName: user.devcourseTrack || "생성형 AI 활용 백엔드",
    devcourseBatch: user.devcourseBatch || "1",
    topics: user.topics || [],
    providerType: user.providerType || "LOCAL", // 추가 필요
  };

  const handleStudentVerification = () => {
    setEditMode(false);
    setVerificationMode(true);
  };

  // URL 쿼리 파라미터에서 현재 탭과 페이지 정보 추출
  const getCurrentTab = () => {
    const tab = searchParams.get("tab");
    const validTabs = [
      "account",
      "posts",
      "likes",
      "bookmarks",
      "changePassword",
      "withdraw",
    ];
    return validTabs.includes(tab) ? tab : "account"; // 기본값은 account
  };

  const getCurrentPage = () => {
    const page = searchParams.get("page");
    const currentPage = page ? Math.max(0, parseInt(page, 10) - 1) : 0; // URL은 1부터, 내부적으로는 0부터
    return currentPage;
  };

  const [activeMenu, setActiveMenu] = useState(getCurrentTab());

  // URL 파라미터 변경 시 activeMenu 업데이트
  useEffect(() => {
    const newTab = getCurrentTab();
    setActiveMenu(newTab);
  }, [searchParams]);

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoggedIn) {
      const currentUrl = `/mypage${window.location.search}`;
      navigate("/login?redirectUrl=" + encodeURIComponent(currentUrl));
    }
  }, [isLoggedIn, navigate]);

  const handleEdit = () => setEditMode(true);

  const handleSave = async (updatedData) => {
    setEditMode(false);
    setCachedProfileData(updatedData); // 업데이트된 데이터 캐시
    try {
      await refreshUserInfo();
      alert("저장되었습니다.");
    } catch (error) {
      console.error("사용자 정보 새로고침 실패:", error);
      alert("저장되었습니다.");
    }
  };

  const handleCancel = () => setEditMode(false);

  const handlePostClick = (post) => {
    navigate(getPostDetailUrl(post));
  };

  // 탭 변경 핸들러 (URL 쿼리 파라미터 업데이트)
  const handleMenuChange = (menu) => {
    setEditMode(false);

    const newSearchParams = new URLSearchParams();

    if (menu === "account") {
      // account는 기본값이므로 쿼리 파라미터 없이
      navigate("/mypage", { replace: true });
    } else if (["posts", "likes", "bookmarks"].includes(menu)) {
      // 게시글 관련 메뉴는 첫 페이지로
      newSearchParams.set("tab", menu);
      newSearchParams.set("page", "1");
      navigate(`/mypage?${newSearchParams.toString()}`, { replace: true });
    } else {
      // 기타 메뉴 (changePassword, withdraw)
      newSearchParams.set("tab", menu);
      navigate(`/mypage?${newSearchParams.toString()}`, { replace: true });
    }
  };

  const handlePageChange = (page) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", (page + 1).toString());
    navigate(`/mypage?${newSearchParams.toString()}`, { replace: true });
  };

  // 로딩 중이거나 로그인하지 않은 경우
  if (!isLoggedIn || !user) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <NavigationBar />
        <div className="d-flex justify-content-center align-items-center flex-grow-1">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">로딩 중...</span>
            </div>
            <p className="text-muted">로딩 중...</p>
          </div>
        </div>
        <FooterBar />
      </div>
    );
  }

  const DETAIL = {
    account: editMode ? (
      <EditProfileForm
        initial={profileData}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    ) : verificationMode ? (
      <StudentVerificationForm
        initial={profileData}
        onSave={(updatedData) => {
          setVerificationMode(false);
        }}
        onCancel={() => setVerificationMode(false)}
      />
    ) : (
      <ProfileSummary
        profile={profileData} // 현재 user 데이터 전달
        onEdit={handleEdit}
        onChangePassword={() => handleMenuChange("changePassword")}
        onStudentVerification={handleStudentVerification}
      />
    ),
    changePassword: (
      <ChangePasswordPage
        onSave={() => handleMenuChange("account")}
        onCancel={() => handleMenuChange("account")}
      />
    ),
    posts: (
      <PostList
        type="posts"
        onPostClick={handlePostClick}
        usePagination={true}
        pageSize={10}
        currentPage={getCurrentPage()}
        onPageChange={handlePageChange}
      />
    ), // 작성글
    likes: (
      <PostList
        type="likes"
        onPostClick={handlePostClick}
        usePagination={true}
        pageSize={10}
        currentPage={getCurrentPage()}
        onPageChange={handlePageChange}
      />
    ), // 좋아요
    bookmarks: (
      <PostList
        type="bookmarks"
        onPostClick={handlePostClick}
        usePagination={true}
        pageSize={10}
        currentPage={getCurrentPage()}
        onPageChange={handlePageChange}
      />
    ), // 북마크
    withdraw: <WithdrawPage profile={profileData} />, // 회원 탈퇴
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* 기존 메인 컨테이너 구조 유지 */}
      <main className="mypage-main-container my-5">
        <div className="mypage-sidebar-col mb-4">
          <MyPageSidebar
            activeMenu={activeMenu}
            onMenuChange={handleMenuChange}
          />
        </div>
        <div className="mypage-content-col">{DETAIL[activeMenu]}</div>
      </main>

      {/* 기존 푸터 바 유지 */}
      <FooterBar />
    </div>
  );
}
