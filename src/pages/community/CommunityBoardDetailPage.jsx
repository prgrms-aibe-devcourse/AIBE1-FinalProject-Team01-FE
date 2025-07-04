import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CommunityBoardDetail } from "../../components/community/CommunityBoardDetail";
import { posts } from "./communityData";
import { useLikeBookmark } from "../../hooks/useLikeBookmark";

/**
 * 커뮤니티 게시글 상세 페이지 컴포넌트
 */
export default function CommunityBoardDetailPage() {
  const { boardType, postId } = useParams();
  const navigate = useNavigate();

  const post = posts.find(
    (p) => p.boardType === boardType && String(p.postId) === String(postId)
  );

  const {
    liked,
    likeCount,
    toggleLike,
    bookmarked,
    bookmarkCount,
    toggleBookmark,
  } = useLikeBookmark({
    initialLikeCount: post?.likeCount,
    initialLiked: post?.isLiked,
    initialBookmarkCount: post?.bookmarkCount,
    initialBookmarked: post?.isBookmarked,
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
    isLiked: liked,
    likeCount: likeCount,
    isBookmarked: bookmarked,
    bookmarkCount: bookmarkCount,
  };

  return (
    <CommunityBoardDetail
      post={detailPost}
      onLike={toggleLike}
      onBookmark={toggleBookmark}
    />
  );
}
