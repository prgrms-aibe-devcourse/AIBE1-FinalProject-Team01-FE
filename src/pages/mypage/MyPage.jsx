import React, { useState } from "react";
import { NavigationBar } from "../../components/common/NavigationBar";
import { FooterBar } from "../../components/common/FooterBar";
import { ProfileSummary } from "../../components/mypage/ProfileSummary";
import { MyPageTabBar } from "../../components/mypage/MyPageTabBar";
import { PostList } from "../../components/mypage/PostList";
import { MyPageSidebar } from "../../components/mypage/MyPageSidebar";
import { EditProfileForm } from "../../components/mypage/EditProfileForm";
import {
  DUMMY_PROFILE,
  DUMMY_POSTS,
  DUMMY_LIKES,
  DUMMY_BOOKMARKS,
} from "./mypageData";
import { MYPAGE_MENU } from "./constants";
import ChangePasswordPage from "./ChangePasswordPage";
import WithdrawPage from "./WithdrawPage";
import { CommunityBoardList } from "../../components/community/CommunityBoardList";
import { useNavigate } from "react-router-dom";
import { getPostDetailUrl } from "../../utils/board";

/**
 * 마이페이지 메인
 */
const TAB_LIST = [
  { key: "posts", label: "작성글" },
  { key: "likes", label: "좋아요" },
  { key: "bookmarks", label: "북마크" },
];

export default function MyPage() {
  const [activeMenu, setActiveMenu] = useState("account");
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => setEditMode(true);
  const handleSave = () => {
    setEditMode(false);
    alert("저장되었습니다.");
  };
  const handleCancel = () => setEditMode(false);

  const handlePostClick = (post) => {
    navigate(getPostDetailUrl(post));
  };

  const DETAIL = {
    account: editMode ? (
      <EditProfileForm
        initial={DUMMY_PROFILE}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    ) : (
      <ProfileSummary
        {...DUMMY_PROFILE}
        onEdit={handleEdit}
        onChangePassword={() => setActiveMenu("changePassword")}
      />
    ),
    changePassword: (
      <ChangePasswordPage onSave={() => setActiveMenu("account")} />
    ),
    posts: (
      <PostList type="posts" data={DUMMY_POSTS} onPostClick={handlePostClick} />
    ), // 작성글
    likes: (
      <PostList type="likes" data={DUMMY_LIKES} onPostClick={handlePostClick} />
    ), // 좋아요
    bookmarks: (
      <PostList
        type="bookmarks"
        data={DUMMY_BOOKMARKS}
        onPostClick={handlePostClick}
      />
    ), // 북마크
    withdraw: <WithdrawPage />, // 회원 탈퇴
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="mypage-main-container my-5">
        <div className="mypage-sidebar-col mb-4">
          <MyPageSidebar
            activeMenu={activeMenu}
            onMenuChange={(menu) => {
              setActiveMenu(menu);
              setEditMode(false);
            }}
          />
        </div>
        <div className="mypage-content-col">{DETAIL[activeMenu]}</div>
      </main>
    </div>
  );
}
