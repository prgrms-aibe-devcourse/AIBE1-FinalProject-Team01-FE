import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HubBoardDetail } from "../../components/hub/HubBoardDetail";
import { hubData } from "./hubData";
import { useLikeBookmark } from "../../hooks/useLikeBookmark";
import { mapHubPost } from "../../utils/hub";
import "../../styles/components/community/community.css";

export default function HubDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const rawPost = hubData.find((p) => String(p.postId) === String(postId));
  const post = rawPost ? mapHubPost(rawPost) : undefined;

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
        <h2>프로젝트를 찾을 수 없습니다.</h2>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate(-1)}
          aria-label="이전 페이지로 돌아가기"
        >
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <HubBoardDetail
      post={post}
      onLike={() => toggleLike(post.postId)}
      onBookmark={() => toggleBookmark(post.postId)}
      likeCount={likeCount}
      isLiked={liked}
      bookmarkCount={bookmarkCount}
      isBookmarked={bookmarked}
    />
  );
}
