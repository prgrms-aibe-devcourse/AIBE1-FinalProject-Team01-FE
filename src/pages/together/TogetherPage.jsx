import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Container, Button, Alert } from "react-bootstrap";
import BoardCategoryBar from "../../components/board/BoardCategoryBar";
import { BoardSearchBar } from "../../components/board/BoardSearchBar";
import TogetherBoardList from "../../components/together/TogetherBoardList";
import MarketBoardList from "../../components/together/MarketBoardList";
import { allTogetherPosts } from "./togetherData";
import { BOARD_TABS } from "./constants";
import { HeroSection } from "../../components/common/HeroSection";
import heroTogetherImg from "../../assets/hero-together.png";
import { useAuth } from "../../context/AuthContext";
import { BoardPagination } from "../../components/board/BoardPagination";

function TogetherPage() {
  const { category = "GATHERING" } = useParams(); // URL 파라미터, 기본값 GATHERING
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  // 검색, 정렬, 페이지네이션 상태
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("최신순");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // URL 파라미터에 따라 탭 이동
  const handleTabClick = (tabId) => {
    navigate(`/together/${tabId}`);
    setPage(1); // 탭 변경 시 페이지 초기화
  };

  // 필터링/정렬/검색 적용
  let filteredPosts = allTogetherPosts.filter(
    (post) =>
      post.boardType === category &&
      (!keyword ||
        post.title.includes(keyword) ||
        post.content?.includes(keyword))
  );
  // 정렬
  if (sort === "최신순") {
    filteredPosts.sort((a, b) =>
      (b.createdAt || "").localeCompare(a.createdAt || "")
    );
  } else if (sort === "조회순") {
    filteredPosts.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
  } else if (sort === "댓글순") {
    filteredPosts.sort(
      (a, b) => (b.comments?.length || 0) - (a.comments?.length || 0)
    );
  } else if (sort === "좋아요순") {
    filteredPosts.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
  }

  // 페이지네이션
  const totalElements = filteredPosts.length;
  const totalPages = Math.ceil(totalElements / pageSize);
  const pagedPosts = filteredPosts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const renderContent = () => {
    if (category === "MARKET") {
      return <MarketBoardList posts={pagedPosts} />;
    }
    return <TogetherBoardList posts={pagedPosts} />;
  };

  return (
    <>
      <HeroSection backgroundImageSrc={heroTogetherImg} />
      <Container className="py-5">
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
          onSearch={() => setPage(1)}
          onWrite={
            isLoggedIn
              ? () => navigate(`/together/${category.toLowerCase()}/write`)
              : undefined
          }
        />

        <div className="mt-4">{renderContent()}</div>
        <BoardPagination page={page} total={totalPages} onChange={setPage} />
      </Container>
    </>
  );
}

export default TogetherPage;
