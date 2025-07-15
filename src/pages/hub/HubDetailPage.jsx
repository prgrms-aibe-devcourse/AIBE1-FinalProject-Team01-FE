import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HubBoardDetail } from "../../components/hub/HubBoardDetail";
import { useLikeBookmark } from "../../hooks/useLikeBookmark";
import { mapApiResponseToHubPost } from "../../utils/hub";
import { getPostById } from "../../services/hubApi";
import { Alert, Spinner } from "react-bootstrap";
import "../../styles/components/community/community.css";

const HubDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const response = await getPostById(projectId);
        const mappedPost = mapApiResponseToHubPost(response);
        setPost(mappedPost);
        setError(null);
      } catch (err) {
        console.error("프로젝트 로드 실패:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadPost();
    }
  }, [projectId]);

  // 로딩 상태
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">로딩 중...</span>
        </Spinner>
        <p className="mt-2">프로젝트를 불러오는 중입니다...</p>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="container py-5 text-center">
        <Alert variant="danger">
          <Alert.Heading>오류가 발생했습니다</Alert.Heading>
          <p>{error}</p>
          <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
            돌아가기
          </button>
        </Alert>
      </div>
    );
  }

  // 프로젝트가 없는 경우
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

  // 프로젝트가 있을 때만 렌더링하는 컴포넌트
  return <HubDetailContent post={post} />;
};
export default HubDetailPage;

/**
 * 실제 상세 내용을 렌더링하는 컴포넌트
 */
function HubDetailContent({ post }) {
  const {
    liked,
    likeCount,
    toggleLike,
    bookmarked,
    bookmarkCount,
    toggleBookmark,
  } = useLikeBookmark({
    initialLikeCount: post.likeCount || 0,
    initialLiked: post.isLiked || false,
    initialBookmarkCount: post.bookmarkCount || 0,
    initialBookmarked: post.isBookmarked || false,
    postId: post.postId,
  });

  const detailPost = {
    ...post,
    isLiked: liked,
    likeCount: likeCount,
    isBookmarked: bookmarked,
    bookmarkCount: bookmarkCount,
  };

  return (
    <HubBoardDetail
      post={detailPost}
      onLike={() => toggleLike(post.postId)}
      onBookmark={() => toggleBookmark(post.postId)}
      likeCount={likeCount}
      isLiked={liked}
      bookmarkCount={bookmarkCount}
      isBookmarked={bookmarked}
    />
  );
}
