import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BoardCategoryBar } from "../../components/board/BoardCategoryBar";
import { BoardSearchBar } from "../../components/board/BoardSearchBar";
import { InfoBoardList } from "../../components/info/InfoBoardList";
import { BoardPagination } from "../../components/board/BoardPagination";
import { HeroSection } from "../../components/common/HeroSection";
import heroInfo from "../../assets/hero-info.png";
import { INFO_TABS } from "./constants";
import { Button, Alert, Spinner } from "react-bootstrap";
import { useInfoPosts } from "../../hooks/useInfoPosts";
import "../../styles/components/board/Board.css";
import "../../styles/components/community/community.css";
import "../../styles/components/info/info.css";
import {CommunityBoardList} from "../../components/community/CommunityBoardList.jsx";

const InfoPage = () => {
  const { boardType = "review" } = useParams();
  const navigate = useNavigate();

  const {
    keyword,
    setKeyword,
    page,
    setPage,
    sort,
    setSort,
    posts,
    totalPages,
    reset,
    loading,
    error,
    search,
    searchTerm
  } = useInfoPosts(boardType);

  const handleTabSelect = (tabKey) => {
    // 탭 변경 시 URL 파라미터도 초기화
    navigate(`/info/${tabKey}`, { replace: true });
  };

  const handlePostClick = (postId) => {
    navigate(`/info/${boardType}/${postId}`);
  };

  // 에러 처리
  if (error) {
    return (
        <>
          <HeroSection backgroundImageSrc={heroInfo} />
          <div className="py-4">
            <div className="community-main-container">
              <Alert variant="danger">
                <Alert.Heading>오류가 발생했습니다</Alert.Heading>
                <p>{error}</p>
                <hr />
                <div className="d-flex justify-content-end">
                  <Button onClick={reset} variant="outline-danger">
                    다시 시도
                  </Button>
                </div>
              </Alert>
            </div>
          </div>
        </>
    );
  }

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
                onWrite={boardType === "review" ? () => navigate(`/info/${boardType}/write`) : undefined}
                sort={sort}
                onSortChange={setSort}
                onSearch={search} // 검색 버튼 클릭 시
            />

            {/* 로딩 상태 표시 */}
            {loading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" size="sm" className="me-2" />
                      게시글을 불러오는 중...
                    </div>
                ) : (
                <>
                  <InfoBoardList posts={posts} onPostClick={handlePostClick} />


                  {posts.length === 0 && (
                      <div className="text-center py-5">
                        <p className="text-muted">
                          {searchTerm ? `"${searchTerm}"에 대한 검색 결과가 없습니다.` : "등록된 게시글이 없습니다."}
                        </p>
                      </div>
                  )}

                  {!loading && posts.length > 0 && totalPages > 1 && (
                      <BoardPagination page={page} total={totalPages} onChange={setPage} />
                  )}
                </>
            )}
          </div>
        </div>
      </>
  );
};
export default InfoPage;