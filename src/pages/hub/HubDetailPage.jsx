import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HubBoardDetail } from "../../components/hub/HubBoardDetail";
import { hubData } from "./hubData";
import "../../styles/components/community/community.css";

export default function HubDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const post = hubData.find((p) => String(p.id) === String(postId));

  if (!post) {
    return (
      <div className="container py-5 text-center">
        <h2>프로젝트를 찾을 수 없습니다.</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
          돌아가기
        </button>
      </div>
    );
  }

  return <HubBoardDetail post={post} />;
}
