import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BoardCategoryBar } from "../../components/board/BoardCategoryBar";
import { BoardSearchBar } from "../../components/board/BoardSearchBar";
import { CommunityBoardList } from "../../components/community/CommunityBoardList";
import { BoardPagination } from "../../components/board/BoardPagination";
import { HeroSection } from "../../components/common/HeroSection";
import heroCommunity from "../../assets/hero-community.png";
import { posts as allPosts } from "./communityData";
import { CATEGORY_KEYS, CATEGORY_MAP } from "./constants";
import { Modal, Button } from "react-bootstrap";
import { useBoardList } from "../../hooks/useBoardList";

const COMMUNITY_TABS = [
  { key: "free", label: "자유게시판" },
  { key: "qna", label: "Q&A" },
  { key: "retrospect", label: "블로그/회고" },
];

export default function CommunityPage() {
  const { category = "free" } = useParams();
  const navigate = useNavigate();

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
  } = useBoardList({ data: allPosts, category });

  useEffect(() => {
    reset();
  }, [category]);

  const handleTabSelect = (catKey) => navigate(`/community/${catKey}`);
  const handlePostClick = (postId) =>
    navigate(`/community/${category}/${postId}`);

  return (
    <>
      <HeroSection backgroundImageSrc={heroCommunity} />
      <div className="py-4">
        <div className="community-main-container">
          <BoardCategoryBar
            selected={category}
            onSelect={handleTabSelect}
            tabs={COMMUNITY_TABS}
          />
          <BoardSearchBar
            keyword={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onWrite={() => navigate(`/community/${category}/write`)}
            sort={sort}
            onSortChange={setSort}
            onSearch={search}
          />
          <CommunityBoardList
            posts={posts}
            categoryLabel={CATEGORY_MAP[category]}
            onPostClick={handlePostClick}
          />
          <BoardPagination page={page} total={totalPages} onChange={setPage} />
        </div>
      </div>
    </>
  );
}
