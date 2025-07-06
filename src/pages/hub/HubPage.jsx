import React, { useState, useMemo, useEffect } from "react";
import { HeroSection } from "../../components/common/HeroSection";
import HubBoardList from "../../components/hub/HubBoardList";
import HubBoardSkeleton from "../../components/hub/HubBoardSkeleton";
import { BoardPagination } from "../../components/board/BoardPagination";
import { HubSearchBar } from "../../components/hub/HubSearchBar";
import { COURSE_NAMES, BATCH_NUMBERS, convertTrackToApi } from "../../constants/devcourse";
import { mapApiResponseToHubPost } from "../../utils/hub";
import heroHub from "../../assets/hero-hub.png";
import "../../styles/components/community/community.css";
import { getPosts } from "../../services/hubApi.js";

export default function HubPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageInfo, setPageInfo] = useState({
    pageNumber: 0,
    pageSize: 9,
    totalPages: 0,
    totalElements: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  
  const [appliedFilters, setAppliedFilters] = useState({
    courseName: "",
    batchNumber: "",
    keyword: "",
  });

  useEffect(() => {
    const fetchHubPosts = async () => {
      try {
        setLoading(true);

        const params = {
          page: currentPage - 1,
          size: 9
        };

        if (appliedFilters.keyword) {
          params.keyword = appliedFilters.keyword;
        }
        if (appliedFilters.courseName) {
          params.course = convertTrackToApi(appliedFilters.courseName);
        }
        if (appliedFilters.batchNumber) {
          params.batch = appliedFilters.batchNumber;
        }

        const response = await getPosts(params);

        setPosts(response.content);
        setPageInfo(response.pageInfo);
        setError(null);
      } catch (err) {
        console.error("허브 게시글 목록을 가져오는 데 실패했습니다.", err);
        setError("데이터를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchHubPosts();
  }, [currentPage, appliedFilters]);

  const mappedPosts = useMemo(() => posts.map(post => mapApiResponseToHubPost(post)), [posts]);

  const handleSearch = (searchFilters) => {
    setAppliedFilters(searchFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
  };

  return (
    <>
      <HeroSection backgroundImageSrc={heroHub} />
      <div className="py-4">
        <div className="community-main-container">
          <HubSearchBar
            courseNames={COURSE_NAMES}
            batchNumbers={BATCH_NUMBERS}
            onSearch={handleSearch}
          />
          {loading && <HubBoardSkeleton count={9} />}
          {error && <div className="text-center text-danger py-4">{error}</div>}
          {!loading && !error && (
            <>
              {mappedPosts.length > 0 ? (
                <HubBoardList posts={mappedPosts} />
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted">검색 조건에 맞는 프로젝트가 없습니다.</p>
                </div>
              )}
              <BoardPagination
                page={currentPage}
                total={pageInfo.totalPages}
                onChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
