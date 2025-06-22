import React from "react";
import { HeroSection } from "../../components/common/HeroSection";
import HubBoardList from "../../components/hub/HubBoardList";
import { hubData } from "./hubData";
import { BoardPagination } from "../../components/board/BoardPagination";
import "../../styles/components/community/community.css";

export default function HubPage() {
  // TODO: Add filtering logic for course, batch, and keyword
  const posts = hubData;

  return (
    <>
      <HeroSection
        title="프로젝트 허브"
        description="데브코스 학생들은 어떤 프로젝트를 만들었을까요? 다른 수강생들의 멋진 아이디어를 구경해보세요."
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
