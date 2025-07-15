import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "../../components/common/HeroSection";
import { BoardPagination } from "../../components/board/BoardPagination";
import HubBoardList from "../../components/hub/HubBoardList";
import { HubSearchBar } from "../../components/hub/HubSearchBar";
import { COURSE_NAMES, BATCH_NUMBERS, convertTrackToApi } from "../../constants/devcourse";
import { mapApiResponseToHubPost } from "../../utils/hub";
import { useHubPosts } from "../../hooks/useHubPosts";
import heroHub from "../../assets/hero-hub.png";
import { Alert, Spinner } from "react-bootstrap";
import "../../styles/components/community/community.css";

const HubPage = () => {
  const navigate = useNavigate();
  
  const {
    posts,
    loading,
    error,
    pageInfo,
    page,
    setPage,
    search,
    reset
  } = useHubPosts();

  // API 응답을 프론트엔드 형식으로 변환
  const mappedPosts = useMemo(() => 
    posts.map(post => mapApiResponseToHubPost(post)), [posts]
  );

  const handleSearch = (searchFilters) => {
    // courseName을 API 형식으로 변환
    const apiFilters = {
      ...searchFilters,
      courseName: searchFilters.courseName ? convertTrackToApi(searchFilters.courseName) : ""
    };
    search(apiFilters);
  };

  const handlePageChange = (newPage) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setPage(newPage);
  };

  // 에러 처리
  if (error) {
    return (
      <>
        <HeroSection backgroundImageSrc={heroHub} />
        <div className="py-4">
          <div className="community-main-container">
            <Alert variant="danger">
              <Alert.Heading>오류가 발생했습니다</Alert.Heading>
              <p>{error}</p>
              <hr />
              <div className="d-flex justify-content-end">
                <button onClick={reset} className="btn btn-outline-danger">
                  다시 시도
                </button>
              </div>
            </Alert>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeroSection backgroundImageSrc={heroHub} />
      <div className="py-4">
        <div className="community-main-container">
          <HubSearchBar
            courseNames={COURSE_NAMES}
            batchNumbers={BATCH_NUMBERS}
            onSearch={handleSearch}
            onWrite={() => navigate(`/hub/write`)}
          />

          {loading && (
            <div className="text-center py-3">
              <Spinner animation="border" size="sm" className="me-2" />
              프로젝트를 불러오는 중...
            </div>
          )}

          {!loading && (
            <>
              {mappedPosts.length > 0 ? (
                <HubBoardList posts={mappedPosts} />
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted">검색 조건에 맞는 프로젝트가 없습니다.</p>
                </div>
              )}
              
              <BoardPagination
                page={page}
                total={pageInfo.totalPages}
                onChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default HubPage;
