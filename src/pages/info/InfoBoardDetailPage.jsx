import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { reviewPosts, newsPosts } from "./infoData";
import InfoBoardDetail from "../../components/info/InfoBoardDetail";

export default function InfoBoardDetailPage() {
  const navigate = useNavigate();
  const { category, postId } = useParams();
  const posts = category === "news" ? newsPosts : reviewPosts;
  const post = posts.find((p) => String(p.id) === String(postId));

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

  const handleEdit = () => {
    navigate(`/info/review/write`, { state: { postToEdit: post } });
  };
  const handleDelete = () => {
    if (window.confirm("정말로 이 후기를 삭제하시겠습니까?")) {
      const idx = reviewPosts.findIndex((p) => p.id === post.id);
      if (idx !== -1) reviewPosts.splice(idx, 1);
      alert("후기가 삭제되었습니다.");
      navigate(`/info/review`);
    }
  };

  return (
    <InfoBoardDetail post={post} onEdit={handleEdit} onDelete={handleDelete} />
  );
}
