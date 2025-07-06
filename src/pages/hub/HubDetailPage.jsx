import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HubBoardDetail } from "../../components/hub/HubBoardDetail";
import { useLikeBookmark } from "../../hooks/useLikeBookmark";
import { mapApiResponseToHubPost } from "../../utils/hub";
import { getPostById } from "../../services/hubApi";
import "../../styles/components/community/community.css";

export default function HubDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await getPostById(projectId);

        // utils 함수를 사용하여 API 응답을 프론트엔드 형식으로 변환
        const mappedPost = mapApiResponseToHubPost(response);

        setPost(mappedPost);
        setError(null);
      } catch (err) {
        console.error("프로젝트 상세 정보를 가져오는 데 실패했습니다.", err);
        setError("프로젝트를 찾을 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchPost();
    }
  }, [projectId]);

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

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">로딩 중...</span>
        </div>
        <p className="mt-3">프로젝트 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container py-5 text-center">
        <h2>{error || "프로젝트를 찾을 수 없습니다."}</h2>
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