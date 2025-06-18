import React, { useState } from "react";
import { CommunityCategoryBar } from "../../components/community/CommunityCategoryBar";
import { CommunitySearchBar } from "../../components/community/CommunitySearchBar";
import { CommunityBoardList } from "../../components/community/CommunityBoardList";
import { CommunityPagination } from "../../components/community/CommunityPagination";
import { NavigationBar } from "../../components/common/NavigationBar";
import { FooterBar } from "../../components/common/FooterBar";

const DUMMY_POSTS = [
  {
    category: "자유게시판",
    title: "요즘 아침에 수업듣기 너무 빡세네요",
    content: "아침에 일어나기 너무 힘들어요... 다들 어떻게 극복하시나요?",
    author: "김루이지",
    time: "2시간 전",
    tags: ["#피곤함", "#데브코스", "#아침수업"],
    likes: 24,
    comments: 5,
    views: 157,
  },
  {
    category: "자유게시판",
    title: "React Hook Form vs Formik 비교 분석해봤어요",
    content:
      "둘 다 써보니 장단점이 확실히 있네요. 여러분은 어떤 걸 선호하시나요?",
    author: "홍길동",
    time: "10시간 전",
    tags: ["#React", "#Hook", "#비교", "#분석"],
    likes: 10,
    comments: 15,
    views: 1457,
  },
];

export default function CommunityPage() {
  const [category, setCategory] = useState("자유게시판");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  // 실제 데이터 연동 시 필터링/검색/페이지네이션 적용 필요
  const filteredPosts = DUMMY_POSTS.filter(
    (post) => post.category === category && post.title.includes(keyword)
  );

  return (
    <>
      <div className="container py-4">
        <h2 className="fw-bold mb-4">커뮤니티 - 자유게시판</h2>
        <CommunityCategoryBar selected={category} onSelect={setCategory} />
        <CommunitySearchBar
          keyword={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onWrite={() => alert("글쓰기 기능 준비중")}
          onFilter={() => alert("필터 기능 준비중")}
        />
        <CommunityBoardList posts={filteredPosts} />
        <CommunityPagination page={page} total={5} onChange={setPage} />
      </div>
    </>
  );
}
