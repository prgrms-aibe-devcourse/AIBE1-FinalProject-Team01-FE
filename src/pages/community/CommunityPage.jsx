import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CommunityCategoryBar } from "../../components/community/CommunityCategoryBar";
import { CommunitySearchBar } from "../../components/community/CommunitySearchBar";
import { CommunityBoardList } from "../../components/community/CommunityBoardList";
import { CommunityPagination } from "../../components/community/CommunityPagination";
import { HeroSection } from "../../components/common/HeroSection";
import heroCommunity from "../../assets/hero-community.png";
import { CATEGORY_MAP, DUMMY_POSTS } from "./communityData";
import { Modal, Button } from "react-bootstrap";

export default function CommunityPage() {
  const navigate = useNavigate();
  const { category = "free" } = useParams();
  const [keyword, setKeyword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("최신순");
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  useEffect(() => {
    setSearchTerm("");
    setKeyword("");
  }, [category]);

  // 목록 필터링
  const filteredPosts = DUMMY_POSTS.filter(
    (post) =>
      post.category === category &&
      (searchTerm === "" || post.title.includes(searchTerm))
  );

  // 정렬 로직 추가
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sort === "최신순") {
      // 최신순: id 기준 내림차순
      return b.id - a.id;
    }
    if (sort === "조회순") {
      return (b.views || 0) - (a.views || 0);
    }
    if (sort === "댓글순") {
      return (b.comments?.length || 0) - (a.comments?.length || 0);
    }
    if (sort === "좋아요순") {
      return (b.likes || 0) - (a.likes || 0);
    }
    return 0;
  });

  // 페이지네이션
  // 한 페이지에 보여줄 게시글 수
  const PAGE_SIZE = 10; // TODO: 백엔드 연동 시 서버에서 받아올 수도 있음
  const totalCount = sortedPosts.length; // TODO: 백엔드 연동 시 서버에서 받아오기
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  // 현재 페이지에 보여줄 게시글
  const pagedPosts = sortedPosts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleTabSelect = (catKey) => {
    navigate(`/community/${catKey}`);
  };

  const handleSearch = () => {
    setSearchTerm(keyword);
  };

  const handlePostClick = (postId) => {
    navigate(`/community/${category}/${postId}`);
  };

  return (
    <>
      <HeroSection backgroundImageSrc={heroCommunity} />
      <div className="py-4">
        <div className="community-main-container">
          <CommunityCategoryBar
            selected={category}
            onSelect={handleTabSelect}
          />
          <CommunitySearchBar
            keyword={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onWrite={() => navigate(`/community/${category}/write`)}
            sort={sort}
            onSortChange={setSort}
            onSearch={handleSearch}
          />
          <CommunityBoardList
            posts={pagedPosts}
            categoryLabel={CATEGORY_MAP[category]}
            onPostClick={handlePostClick}
          />
          <CommunityPagination
            page={page}
            total={totalPages}
            onChange={setPage}
          />
        </div>
      </div>
    </>
  );
}
