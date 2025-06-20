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
import { useCommunityBoardList } from "../../hooks/useFilterSearch";

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
    categoryLabel,
    reset,
  } = useCommunityBoardList(category);

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
            onSearch={search}
          />
          <CommunityBoardList
            posts={posts}
            categoryLabel={categoryLabel}
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
