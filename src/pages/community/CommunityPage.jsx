import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BoardCategoryBar } from "../../components/board/BoardCategoryBar";
import { BoardSearchBar } from "../../components/board/BoardSearchBar";
import { CommunityBoardList } from "../../components/community/CommunityBoardList";
import { BoardPagination } from "../../components/board/BoardPagination";
import { HeroSection } from "../../components/common/HeroSection";
import heroCommunity from "../../assets/hero-community.png";
import { posts as allPosts } from "./communityData";
import { BOARD_TYPE, BOARD_TYPE_LABEL } from "./constants";
import { Modal, Button } from "react-bootstrap";
import { useBoardList } from "../../hooks/useBoardList";

const COMMUNITY_TABS = [
  { key: BOARD_TYPE.FREE, label: BOARD_TYPE_LABEL.FREE },
  { key: BOARD_TYPE.QNA, label: BOARD_TYPE_LABEL.QNA },
  { key: BOARD_TYPE.RETROSPECT, label: BOARD_TYPE_LABEL.RETROSPECT },
];

/**
 * 커뮤니티 메인 페이지 컴포넌트
 */
export default function CommunityPage() {
  const { boardType = BOARD_TYPE.FREE } = useParams();
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
  } = useBoardList({
    data: allPosts,
    boardType,
  });

  useEffect(() => {
    reset();
  }, [boardType]);

  const handleTabSelect = (tabKey) => navigate(`/community/${tabKey}`);
  const handlePostClick = (postId) =>
    navigate(`/community/${boardType}/${postId}`);

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
            // TODO: 수강생만 글쓰기 가능하도록 수정 필요
            onWrite={() => navigate(`/community/${boardType}/write`)}
            sort={sort}
            onSortChange={setSort}
            onSearch={search}
          />
          <CommunityBoardList posts={posts} onPostClick={handlePostClick} />
          <BoardPagination page={page} total={totalPages} onChange={setPage} />
        </div>
      </div>
    </>
  );
}
