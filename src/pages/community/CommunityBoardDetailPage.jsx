import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommunityBoardDetail from "../../components/community/CommunityBoardDetail";
import { posts } from "./communityData";

export default function CommunityBoardDetailPage() {
  const navigate = useNavigate();
  const { category, postId } = useParams();

  const post = posts.find(
    (p) => p.category === category && String(p.id) === String(postId)
  );

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

  return <CommunityBoardDetail post={post} />;
}
