import React from "react";
import { HeroSection } from "../../components/common/HeroSection";
import heroCommunity from "../../assets/hero-community.png";
import { CommunitySearchBar } from "../../components/community/CommunitySearchBar";
import { CommunityBoardList } from "../../components/community/CommunityBoardList";
import { CommunityPagination } from "../../components/community/CommunityPagination";
import { gatheringData, matchData, marketData } from "./togetherData";
import { useBoardList } from "../../hooks/useBoardList";

const CATEGORY_LIST = [
  { key: "gathering", label: "팀원구하기" },
  { key: "match", label: "커피챗/멘토링" },
  { key: "market", label: "장터" },
];

const CATEGORY_DATA = {
  gathering: gatheringData,
  match: matchData,
  market: marketData,
};

export default function TogetherPage() {
  const [category, setCategory] = React.useState("gathering");
  const data = CATEGORY_DATA[category] || [];

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
  } = useBoardList({ data });

  React.useEffect(() => {
    reset();
  }, [category]);

  // time 필드 추가 (작성 시간 표시용, 예시)
  const now = new Date();
  const postsWithTime = posts.map((item) => ({
    ...item,
    time: `${Math.max(
      1,
      Math.floor((now - new Date(item.date)) / (1000 * 60 * 60 * 24))
    )}일 전`,
    comments: item.comments || 0,
    views: item.views || 0,
    likes: item.likes || 0,
    tags: item.tags || [],
    author: item.author,
    category: item.category,
  }));

  return (
    <>
      <HeroSection backgroundImageSrc={heroCommunity} />
      <div className="py-4">
        <div className="community-main-container">
          <div className="mb-3">
            <ul className="community-category-bar nav nav-tabs mb-0">
              {CATEGORY_LIST.map((cat) => (
                <li className="nav-item" key={cat.key}>
                  <button
                    className={`nav-link${
                      category === cat.key ? " active" : ""
                    }`}
                    onClick={() => {
                      setCategory(cat.key);
                    }}
                    type="button"
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <CommunitySearchBar
            keyword={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onWrite={() => {}}
            sort={sort}
            onSortChange={setSort}
            onSearch={search}
          />
          <CommunityBoardList posts={postsWithTime} />
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
