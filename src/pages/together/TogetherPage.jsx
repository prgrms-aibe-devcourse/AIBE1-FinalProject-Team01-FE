import React from "react";
import { useEffect } from "react";
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
import {Spinner} from "react-bootstrap";
import {CommunityBoardList} from "../../components/community/CommunityBoardList.jsx";
//import { useBoardList } from "../../hooks/useBoardList";
//import { allTogetherPosts } from "./togetherData";

/**
 * 투게더 메인 페이지 컴포넌트
 */
function TogetherPage() {
  const { boardType = "gathering" } = useParams();
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
    loading,
    posts: pagedPosts,
    totalPages,
    reset,
    searchTerm
  } = useTogetherPosts(boardType);

  // URL 파라미터에 따라 탭 이동
  const handleTabClick = (boardType) => {
    navigate(`/together/${boardType}`, { replace: true });
  };


  const renderContent = () => {
    if (boardType === "market") {
      return <MarketBoardList posts={pagedPosts} boardType={boardType} />;
    }
    return <TogetherBoardList posts={pagedPosts} boardType={boardType} />;
  };

  return (
    <>
      <HeroSection backgroundImageSrc={heroTogetherImg} />
      <div className="py-4">
        <div className="community-main-container">
          <BoardCategoryBar
            tabs={BOARD_TABS}
            activeTab={boardType}
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
              navigate(`/together/${boardType.toLowerCase()}/write`)
            }
          />
          {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" size="sm" className="me-2" />
                게시글을 불러오는 중...
              </div>
          ) : (
              <>
                <div className="mt-4">{renderContent()}</div>

                {pagedPosts.length === 0 && !loading && (
                    <div className="text-center py-5">
                      <p className="text-muted">
                        {searchTerm ? `"${searchTerm}"에 대한 검색 결과가 없습니다.` : "등록된 게시글이 없습니다."}
                      </p>
                    </div>
                )}

                {/* 페이지네이션 */}
                {!loading && pagedPosts.length > 0 && totalPages > 1 && (
                    <BoardPagination page={page} total={totalPages} onChange={setPage} />
                )}
              </>
          )}
        </div>
      </div>
    </>
  );
}

export default TogetherPage;
