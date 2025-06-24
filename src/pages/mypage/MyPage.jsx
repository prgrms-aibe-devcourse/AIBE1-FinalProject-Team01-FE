import React, { useState } from "react";
import { NavigationBar } from "../../components/common/NavigationBar";
import { FooterBar } from "../../components/common/FooterBar";
import { ProfileSummary } from "../../components/mypage/ProfileSummary";
import { MyPageTabBar } from "../../components/mypage/MyPageTabBar";
import { PostList } from "../../components/mypage/PostList";

/**
 * 마이페이지 메인
 */
const TAB_LIST = [
  { key: "posts", label: "작성글" },
  { key: "likes", label: "좋아요" },
  { key: "bookmarks", label: "북마크" },
];

export default function MyPage() {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <main className="container my-5">
      <ProfileSummary />
      <MyPageTabBar
        tabs={TAB_LIST}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="mt-4">
        <PostList type={activeTab} />
      </div>
    </main>
  );
}
