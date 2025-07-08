import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import BoardCategoryBar from "../../components/board/BoardCategoryBar";
import { BoardSearchBar } from "../../components/board/BoardSearchBar";
import TogetherBoardList from "../../components/together/TogetherBoardList";
import MarketBoardList from "../../components/together/MarketBoardList";
import { BOARD_TABS } from "./constants";
import { HeroSection } from "../../components/common/HeroSection";
import heroTogetherImg from "../../assets/hero-together.png";
import { useAuth } from "../../context/AuthContext";
import { BoardPagination } from "../../components/board/BoardPagination";
import useTogetherPosts from "../../hooks/useTogetherPosts";
//import { useBoardList } from "../../hooks/useBoardList";
//import { allTogetherPosts } from "./togetherData";

/**
 * 투게더 메인 페이지 컴포넌트
 */
function TogetherPage() {
  const { category = "GATHERING" } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const {
    keyword,
    setKeyword,
    search,
    page,
    setPage,
    sort,
    setSort,
    posts: pagedPosts,
    totalPages,
    reset,
  } = useTogetherPosts(category);

  // URL 파라미터에 따라 탭 이동
  const handleTabClick = (tabId) => {
    navigate(`/together/${tabId}`);
    reset();
  };

  const renderContent = () => {
    if (category === "MARKET") {
      return <MarketBoardList posts={pagedPosts} />;
    }
    return <TogetherBoardList posts={pagedPosts} />;
  };

  return (
    <>
      <HeroSection backgroundImageSrc={heroTogetherImg} />
      <div className="py-4">
        <div className="community-main-container">
          <BoardCategoryBar
            tabs={BOARD_TABS}
            activeTab={category}
            onTabClick={handleTabClick}
          />

          <BoardSearchBar
            keyword={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            sort={sort}
            onSortChange={setSort}
            onSearch={search}
            // TODO: 수강생만 글쓰기 가능하도록 수정 필요
            onWrite={() =>
              navigate(`/together/${category.toLowerCase()}/write`)
            }
          />

          <div className="mt-4">{renderContent()}</div>
          <BoardPagination page={page} total={totalPages} onChange={setPage} />
        </div>
      </div>
    </>
  );
}

export default TogetherPage;
