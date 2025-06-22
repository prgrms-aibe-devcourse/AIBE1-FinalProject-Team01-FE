import "../../styles/components/board/Board.css";
import "../../styles/components/community/community.css";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { INFO_TABS, INFO_CATEGORY_LABELS } from "./constants";
import { reviewPosts, newsPosts } from "./infoData";
import InfoBoardList from "../../components/info/InfoBoardList";
import { BoardCategoryBar } from "../../components/board/BoardCategoryBar";
import { BoardSearchBar } from "../../components/board/BoardSearchBar";
import { BoardPagination } from "../../components/board/BoardPagination";
import { HeroSection } from "../../components/common/HeroSection";
import heroInfo from "../../assets/hero-info.png";
import { useBoardList } from "../../hooks/useBoardList";

const allInfoPosts = [...reviewPosts, ...newsPosts];

export default function InfoPage() {
  const { category = "review" } = useParams();
  const navigate = useNavigate();

  const handleTabSelect = (catKey) => navigate(`/info/${catKey}`);

  // useBoardList 훅을 info 데이터에 맞게 사용
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
  } = useBoardList({ data: allInfoPosts, category });

  useEffect(() => {
    reset();
  }, [category]);

  const handlePostClick = (postId) => {
    navigate(`/info/${category}/${postId}`);
  };

  const handleWrite = () => navigate(`/info/${category}/write`);

  return (
    <>
      <HeroSection backgroundImageSrc={heroInfo} />
      <div className="py-4">
        <div className="community-main-container">
          <BoardCategoryBar
            selected={category}
            onSelect={handleTabSelect}
            tabs={INFO_TABS}
          />
          <BoardSearchBar
            keyword={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onWrite={category === "review" ? handleWrite : undefined}
            sort={sort}
            onSortChange={setSort}
            onSearch={search}
          />
          <InfoBoardList
            posts={posts}
            category={category}
            onPostClick={handlePostClick}
          />
          <BoardPagination page={page} total={totalPages} onChange={setPage} />
        </div>
      </div>
    </>
  );
}
