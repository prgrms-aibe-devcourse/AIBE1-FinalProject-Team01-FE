import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BoardCategoryBar } from "../../components/board/BoardCategoryBar";
import { BoardSearchBar } from "../../components/board/BoardSearchBar";
import { CommunityBoardList } from "../../components/community/CommunityBoardList";
import { BoardPagination } from "../../components/board/BoardPagination";
import { HeroSection } from "../../components/common/HeroSection";
import heroCommunity from "../../assets/hero-community.png";
import { BOARD_TYPE, BOARD_TYPE_LABEL } from "./constants";
import { Button, Alert, Spinner } from "react-bootstrap";
import { useCommunityPosts } from "../../hooks/useCommunityPosts";

const COMMUNITY_TABS = [
  { key: BOARD_TYPE.FREE, label: BOARD_TYPE_LABEL.FREE },
  { key: BOARD_TYPE.QNA, label: BOARD_TYPE_LABEL.QNA },
  { key: BOARD_TYPE.RETROSPECT, label: BOARD_TYPE_LABEL.RETROSPECT },
];

const CommunityPage = () => {
  const { boardType = "free" } = useParams();
  const navigate = useNavigate();

  // boardType이 없으면 리다이렉트
  useEffect(() => {
    if (!boardType) {
      navigate("/community/free", { replace: true });
    }
  }, [boardType, navigate]);

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
  } = useCommunityPosts(boardType);

  const handleTabSelect = (tabKey) => {
    navigate(`/community/${tabKey}`, { replace: true });
  };

  const handlePostClick = (communityId) => {
    navigate(`/community/${boardType}/${communityId}`);
  };

  // 에러 처리
  if (error) {
    return (
        <>
          <HeroSection backgroundImageSrc={heroCommunity} />
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
        <HeroSection backgroundImageSrc={heroCommunity} />
        <div className="py-4">
          <div className="community-main-container">
            <BoardCategoryBar
                selected={boardType}
                onSelect={handleTabSelect}
                tabs={COMMUNITY_TABS}
            />
            <BoardSearchBar
                keyword={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onWrite={() => navigate(`/community/${boardType}/write`)}
                sort={sort}
                onSortChange={setSort}
                onSearch={search}
            />

            {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" size="sm" className="me-2" />
                  게시글을 불러오는 중...
                </div>
            ) : (
                <>
                  <CommunityBoardList posts={posts} onPostClick={handlePostClick} />

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

export default CommunityPage;