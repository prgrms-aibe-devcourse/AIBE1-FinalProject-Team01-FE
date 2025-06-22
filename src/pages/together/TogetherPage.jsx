import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BoardCategoryBar } from "../../components/board/BoardCategoryBar";
import { BoardSearchBar } from "../../components/board/BoardSearchBar";
import { BoardPagination } from "../../components/board/BoardPagination";
import { HeroSection } from "../../components/common/HeroSection";
import heroTogether from "../../assets/hero-together.png";
import { useBoardList } from "../../hooks/useBoardList";
import { gatheringData, matchData, marketData } from "./togetherData";
import { TogetherBoardList } from "../../components/together/TogetherBoardList";
import { MarketBoardList } from "../../components/together/MarketBoardList";
import "../../styles/components/community/community.css";

const allTogetherPosts = [...gatheringData, ...matchData, ...marketData];

// 함께해요 카테고리(탭) 목록
const TOGETHER_TABS = [
  { key: "gathering", label: "팀원 구하기" },
  { key: "match", label: "커피챗/멘토링" },
  { key: "market", label: "장터" },
];

export default function TogetherPage() {
  const { category = "gathering" } = useParams();
  const navigate = useNavigate();

  const handleTabSelect = (catKey) => navigate(`/together/${catKey}`);

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
  } = useBoardList({ data: allTogetherPosts, category });

  useEffect(() => {
    reset();
  }, [category]);

  const handlePostClick = (postId) => {
    navigate(`/together/${category}/${postId}`);
  };

  return (
    <>
      <HeroSection backgroundImageSrc={heroTogether} />
      <div className="py-4">
        <div className="community-main-container">
          <BoardCategoryBar
            selected={category}
            onSelect={handleTabSelect}
            tabs={TOGETHER_TABS}
          />
          <BoardSearchBar
            keyword={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onWrite={() => navigate(`/together/${category}/write`)}
            sort={sort}
            onSortChange={setSort}
            onSearch={search}
          />

          {category === "market" ? (
            <MarketBoardList posts={posts} onPostClick={handlePostClick} />
          ) : (
            <TogetherBoardList posts={posts} onPostClick={handlePostClick} />
          )}

          <BoardPagination page={page} total={totalPages} onChange={setPage} />
        </div>
      </div>
    </>
  );
}
