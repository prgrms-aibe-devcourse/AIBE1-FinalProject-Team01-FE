import React from "react";
import { HeroSection } from "../../components/common/HeroSection";
import HubBoardList from "../../components/hub/HubBoardList";
import { hubData } from "./hubData";
import { BoardPagination } from "../../components/board/BoardPagination";
import heroHub from "../../assets/hero-hub.png";
import "../../styles/components/community/community.css";

export default function HubPage() {
  // TODO: Add filtering logic for course, batch, and keyword
  const posts = hubData;

  return (
    <>
      <HeroSection
        backgroundImageSrc={heroHub}
        label="아마추어스"
        title="프로젝트 허브"
        description="프로그래머스 데브코스 수강생들의 프로젝트 전시 공간<br/>데브코스 학생들은 어떤 아이디어를 가지고 있을까요?"
      />
      <div className="py-4">
        <div className="community-main-container">
          {/* TODO: Add HubSearchBar component here */}
          <div className="alert alert-info my-3">
            코스별/기수별 필터 및 검색 기능이 여기에 추가될 예정입니다.
          </div>
          <HubBoardList posts={posts} />
          <BoardPagination page={1} total={1} onChange={() => {}} />
        </div>
      </div>
    </>
  );
}
