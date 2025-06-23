import "../../styles/components/board/Board.css";
import "../../styles/components/community/community.css";
import "../../styles/components/info/info.css";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { INFO_TABS } from "./constants";
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
  let { boardType = "REVIEW" } = useParams();
  const navigate = useNavigate();

  const handleTabSelect = (tabKey) => navigate(`/info/${tabKey}`);

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
  } = useBoardList({ data: allInfoPosts, boardType });

  useEffect(() => {
    reset();
  }, [boardType]);

  const handlePostClick = (postId) => {
    navigate(`/info/${boardType}/${postId}`);
  };

  const handleWrite = () => navigate(`/info/${boardType}/write`);

  return (
    <>
      <HeroSection backgroundImageSrc={heroInfo} />
      <div className="py-4">
        <div className="community-main-container">
          <BoardCategoryBar
            selected={boardType}
            onSelect={handleTabSelect}
            tabs={INFO_TABS}
          />
          <BoardSearchBar
            keyword={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onWrite={boardType === "REVIEW" ? handleWrite : undefined}
            sort={sort}
            onSortChange={setSort}
            onSearch={search}
          />
          <InfoBoardList posts={posts} onPostClick={handlePostClick} />
          <BoardPagination page={page} total={totalPages} onChange={setPage} />
        </div>
      </div>
    </>
  );
}
