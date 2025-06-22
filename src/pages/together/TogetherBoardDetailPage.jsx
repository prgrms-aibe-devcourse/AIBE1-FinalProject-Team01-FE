import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TogetherBoardDetail } from "../../components/together/TogetherBoardDetail";
import { MarketBoardDetail } from "../../components/together/MarketBoardDetail";
import { gatheringData, matchData, marketData } from "./togetherData";

const ALL_TOGETHER_POSTS = [...gatheringData, ...matchData, ...marketData];

export const TogetherBoardDetailPage = () => {
  const navigate = useNavigate();
  const { category, postId } = useParams();

  // URL 파라미터와 일치하는 게시글 찾기
  const post = ALL_TOGETHER_POSTS.find((p) => {
    // URL의 category가 'match'이면 'gathering' board_type에서 찾아야 함
    const boardType = category === "match" ? "gathering" : category;
    return p.board_type === boardType && String(p.id) === String(postId);
  });

  if (!post) {
    return (
      <div className="container py-5 text-center">
        <h2>게시글을 찾을 수 없습니다.</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
          돌아가기
        </button>
      </div>
    );
  }

  // board_type에 따라 다른 상세 페이지 컴포넌트 렌더링
  if (post.board_type === "market") {
    return <MarketBoardDetail post={post} />;
  }

  return <TogetherBoardDetail post={post} />;
};
