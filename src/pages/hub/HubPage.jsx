import React, { useState, useMemo } from "react";
import { HeroSection } from "../../components/common/HeroSection";
import HubBoardList from "../../components/hub/HubBoardList";
import { hubData } from "./hubData";
import { BoardPagination } from "../../components/board/BoardPagination";
import { HubSearchBar } from "../../components/hub/HubSearchBar";
import { COURSE_NAMES, BATCH_NUMBERS } from "../../constants/devcourse";
import { mapHubPost } from "../../utils/hub";
import heroHub from "../../assets/hero-hub.png";
import "../../styles/components/community/community.css";

// 추후 허브 게시판 구조에 맞춰  수정 예정
export default function HubPage() {
  const [filters, setFilters] = useState({
    courseName: "",
    batchNumber: "",
    keyword: "",
  });

  // 변환된 데이터 사용
  const mappedPosts = useMemo(() => hubData.map(mapHubPost), [hubData]);

  const filteredPosts = useMemo(() => {
    return mappedPosts.filter((post) => {
      const matchesCourse =
        !filters.courseName || post.courseName === filters.courseName;
      const matchesBatch =
        !filters.batchNumber ||
        post.batchNumber === Number(filters.batchNumber);
      const matchesKeyword =
        !filters.keyword ||
        post.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        (post.simpleContent &&
          post.simpleContent
            .toLowerCase()
            .includes(filters.keyword.toLowerCase()));

      return matchesCourse && matchesBatch && matchesKeyword;
    });
  }, [mappedPosts, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  return (
    <>
      <HeroSection backgroundImageSrc={heroHub} />
      <div className="py-4">
        <div className="community-main-container">
          <HubSearchBar
            courseNames={COURSE_NAMES}
            batchNumbers={BATCH_NUMBERS}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          <HubBoardList posts={filteredPosts} />
          <BoardPagination
            page={1}
            total={Math.ceil(filteredPosts.length / 10)}
            onChange={() => {}}
          />
        </div>
      </div>
    </>
  );
}
