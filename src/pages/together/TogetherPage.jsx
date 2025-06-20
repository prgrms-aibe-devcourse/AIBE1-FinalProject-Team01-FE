import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CommunityCategoryBar } from "../../components/community/CommunityCategoryBar";
import { CommunitySearchBar } from "../../components/community/CommunitySearchBar";
import { CommunityPagination } from "../../components/community/CommunityPagination";
import { HeroSection } from "../../components/common/HeroSection";
import heroTogether from "../../assets/hero-together.png";
import { useBoardList } from "../../hooks/useBoardList";
import { gatheringData, matchData, marketData } from "./togetherData";
import { TogetherBoardList } from "../../components/together/TogetherBoardList";
import "../../styles/components/community/community.css";

// 함께해요 카테고리(탭) 목록
const TOGETHER_TABS = [
  { key: "gathering", label: "팀원 구하기" },
  { key: "match", label: "커피챗/멘토링" },
  { key: "market", label: "장터" },
];

// 카테고리별 데이터 매핑
const DATA_MAP = {
  gathering: gatheringData,
  match: matchData,
  market: marketData,
};

export default function TogetherPage() {
  const { category = "match" } = useParams();
  const navigate = useNavigate();

  const handleTabSelect = (catKey) => navigate(`/together/${catKey}`);
  const data = DATA_MAP[category] || [];

  const {
    keyword,
    setKeyword,
    search,
    page,
    setPage,
    sort,
    setSort,
    posts,
    totalPages,
    reset,
  } = useBoardList({ data });

  useEffect(() => {
    reset();
  }, [category]);

  const handlePostClick = (postId) => {
    // 상세 페이지 이동 등 구현 필요시 여기에 작성
  };

  return (
    <>
      <HeroSection backgroundImageSrc={heroTogether} />
      <div className="py-4">
        <div className="community-main-container">
          <CommunityCategoryBar
            selected={category}
            onSelect={handleTabSelect}
            tabs={TOGETHER_TABS}
          />
          <CommunitySearchBar
            keyword={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onWrite={() => alert("글쓰기 기능은 추후 지원됩니다.")}
            sort={sort}
            onSortChange={setSort}
            onSearch={search}
          />
          <TogetherBoardList posts={posts} onPostClick={handlePostClick} />
          <CommunityPagination
            page={page}
            total={totalPages}
            onChange={setPage}
          />
        </div>
      </div>
    </>
  );
}
