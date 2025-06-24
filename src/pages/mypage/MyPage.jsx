import React, { useState } from "react";
import { NavigationBar } from "../../components/common/NavigationBar";
import { FooterBar } from "../../components/common/FooterBar";
import { ProfileSummary } from "../../components/mypage/ProfileSummary";
import { MyPageTabBar } from "../../components/mypage/MyPageTabBar";
import { PostList } from "../../components/mypage/PostList";
import { MyPageSidebar } from "../../components/mypage/MyPageSidebar";

/**
 * 마이페이지 메인
 */
const TAB_LIST = [
  { key: "posts", label: "작성글" },
  { key: "likes", label: "좋아요" },
  { key: "bookmarks", label: "북마크" },
];

const DETAIL = {
  account: <ProfileSummary />, // 계정 관리(회원정보)
  posts: <PostList type="posts" />, // 작성글
  likes: <PostList type="likes" />, // 좋아요
  bookmarks: <PostList type="bookmarks" />, // 북마크
  withdraw: <div className="card p-4">회원 탈퇴 페이지 준비중</div>,
};

export default function MyPage() {
  const [activeMenu, setActiveMenu] = useState("account");

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="container my-5">
        <div className="row">
          <div className="col-md-3 mb-4">
            <MyPageSidebar
              activeMenu={activeMenu}
              onMenuChange={setActiveMenu}
            />
          </div>
          <div className="col-md-9">{DETAIL[activeMenu]}</div>
        </div>
      </main>
    </div>
  );
}
