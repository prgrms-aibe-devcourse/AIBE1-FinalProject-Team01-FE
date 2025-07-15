import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CommunityBoardDetail } from "../../components/community/CommunityBoardDetail";
import { useLikeBookmark } from "../../hooks/useLikeBookmark";
import { getCommunityPost } from "../../services/communityApi.js"

/**
 * 커뮤니티 게시글 상세 페이지 컴포넌트
 */
const CommunityBoardDetailPage = () => {
  const { boardType, communityId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 게시글 데이터 로드
  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const postData = await getCommunityPost(boardType, communityId);
        setPost(postData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (boardType && communityId) {
      loadPost();
    }
  }, [boardType, communityId]);

  // 로딩 상태
  if (loading) {
    return (
        <div className="container py-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">로딩 중...</span>
          </div>
          <p className="mt-2">게시글을 불러오는 중입니다...</p>
        </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
        <div className="container py-5 text-center">
          <h2>오류가 발생했습니다</h2>
          <p>{error}</p>
          <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
            돌아가기
          </button>
        </div>
    );
  }

  // 게시글이 없는 경우
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

  // 게시글이 있을 때만 렌더링하는 컴포넌트
  return <CommunityDetailContent post={post} />;
};
export default CommunityBoardDetailPage;

/**
 * 실제 상세 내용을 렌더링하는 컴포넌트 (post가 확실히 있을 때만 사용)
 */
function CommunityDetailContent({ post }) {
  // Hook은 여기서 안전하게 호출됩니다
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
      <CommunityBoardDetail
          post={detailPost}
          onLike={toggleLike}
          onBookmark={toggleBookmark}
      />
  );
}
