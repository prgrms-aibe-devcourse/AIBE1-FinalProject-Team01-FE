import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CommunityCategoryBar } from "../../components/community/CommunityCategoryBar";
import { CommunitySearchBar } from "../../components/community/CommunitySearchBar";
import { CommunityBoardList } from "../../components/community/CommunityBoardList";
import { CommunityPagination } from "../../components/community/CommunityPagination";
import { HeroSection } from "../../components/common/HeroSection";
import heroCommunity from "../../assets/hero-community.png";
import CommunityBoardDetail from "../../components/community/CommunityBoardDetail";
import { CATEGORY_MAP, DUMMY_POSTS } from "./communityData";
import { Modal, Button } from "react-bootstrap";

export default function CommunityPage() {
  const navigate = useNavigate();
  const { category = "free", postId } = useParams();
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

  // 상세 페이지용 게시글 찾기
  const selectedPost = postId
    ? DUMMY_POSTS.find(
        (post) =>
          post.category === category && String(post.id) === String(postId)
      )
    : null;

  // 목록 필터링
  const filteredPosts = DUMMY_POSTS.filter(
    (post) =>
      post.category === category &&
      (searchTerm === "" || post.title.includes(searchTerm))
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

  if (postId) {
    if (!selectedPost) {
      return (
        <div className="container py-5 text-center">
          <h2>게시글을 찾을 수 없습니다.</h2>
          <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
            돌아가기
          </button>
        </div>
      );
    }
    return <CommunityBoardDetail post={selectedPost} />;
  }

  return (
    <>
      <HeroSection backgroundImageSrc={heroCommunity} />
      <div className="container py-4">
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
            posts={filteredPosts}
            categoryLabel={CATEGORY_MAP[category]}
            onPostClick={handlePostClick}
          />
          <CommunityPagination page={page} total={5} onChange={setPage} />
        </div>
      </div>
    </>
  );
}
