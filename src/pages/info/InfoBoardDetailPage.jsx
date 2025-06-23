import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { reviewPosts, newsPosts } from "./infoData";
import InfoBoardDetail from "../../components/info/InfoBoardDetail";
import { useLikeBookmark } from "../../hooks/useLikeBookmark";

export default function InfoBoardDetailPage() {
  const navigate = useNavigate();
  let { boardType, postId } = useParams();
  boardType = boardType.toUpperCase();
  const posts = boardType === "NEWS" ? newsPosts : reviewPosts;
  const post = posts.find((p) => String(p.postId) === String(postId));

  const {
    liked,
    likeCount,
    toggleLike,
    bookmarked,
    bookmarkCount,
    toggleBookmark,
  } = useLikeBookmark({
    initialLikeCount: post?.likeCount || 0,
    initialLiked: post?.isLiked || false,
    initialBookmarkCount: post?.bookmarkCount || 0,
    initialBookmarked: post?.isBookmarked || false,
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

  const handleEdit = () => {
    navigate(`/info/${boardType}/write`, { state: { postToEdit: post } });
  };
  const handleDelete = () => {
    if (window.confirm("정말로 이 글을 삭제하시겠습니까?")) {
      const idx = posts.findIndex((p) => p.postId === post.postId);
      if (idx !== -1) posts.splice(idx, 1);
      alert("글이 삭제되었습니다.");
      navigate(`/info/${boardType}`);
    }
  };

  return (
    <InfoBoardDetail
      post={{
        ...post,
        isLiked: liked,
        likeCount: likeCount,
        isBookmarked: bookmarked,
        bookmarkCount: bookmarkCount,
      }}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onLike={toggleLike}
      onBookmark={toggleBookmark}
    />
  );
}
