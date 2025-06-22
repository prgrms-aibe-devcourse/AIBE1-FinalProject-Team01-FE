import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import CommunityBoardDetail from "../../components/community/CommunityBoardDetail";
import { posts } from "./communityData";
import { useLikeBookmark } from "../../hooks/useLikeBookmark";

export default function CommunityBoardDetailPage() {
  const { category, postId } = useParams();
  const navigate = useNavigate();

  const post = posts.find(
    (p) => p.category === category && String(p.id) === String(postId)
  );

  const {
    liked,
    likeCount,
    toggleLike,
    bookmarked,
    bookmarkCount,
    toggleBookmark,
  } = useLikeBookmark({
    initialLikeCount: post?.like_count,
    initialLiked: post?.is_liked,
    initialBookmarkCount: post?.bookmark_count,
    initialBookmarked: post?.is_bookmarked,
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

  const detailPost = {
    ...post,
    is_liked: liked,
    like_count: likeCount,
    is_bookmarked: bookmarked,
    bookmark_count: bookmarkCount,
  };

  return (
    <CommunityBoardDetail
      post={detailPost}
      onLike={toggleLike}
      onBookmark={toggleBookmark}
    />
  );
}
