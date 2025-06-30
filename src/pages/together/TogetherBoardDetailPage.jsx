import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Spinner, Alert } from "react-bootstrap";
import TogetherBoardDetail from "../../components/together/TogetherBoardDetail";
import MarketBoardDetail from "../../components/together/MarketBoardDetail";
import { allTogetherPosts } from "./togetherData";
import { useLikeBookmark } from "../../hooks/useLikeBookmark";

function TogetherBoardDetailPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: API 연동
    try {
      setLoading(true);
      const currentPost = allTogetherPosts.find(
        (p) => p.postId === parseInt(postId, 10)
      );
      if (currentPost) {
        setPost(currentPost);
      } else {
        setError("게시글을 찾을 수 없습니다.");
      }
    } catch (err) {
      setError("게시글을 불러오는 데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const {
    liked,
    likeCount,
    toggleLike,
    bookmarked,
    bookmarkCount,
    toggleBookmark,
  } = useLikeBookmark({
    initialLikeCount: post?.likeCount ?? 0,
    initialLiked: post?.isLiked ?? false,
    initialBookmarkCount: post?.bookmarkCount ?? 0,
    initialBookmarked: post?.isBookmarked ?? false,
    postId: post?.postId,
    boardType: post?.boardType,
  });

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">{error || "게시글을 찾을 수 없습니다."}</Alert>
      </Container>
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
    <Container className="py-5">
      {post.boardType === "MARKET" ? (
        <MarketBoardDetail
          post={detailPost}
          onLike={toggleLike}
          onBookmark={toggleBookmark}
        />
      ) : (
        <TogetherBoardDetail
          post={detailPost}
          onLike={toggleLike}
          onBookmark={toggleBookmark}
        />
      )}
    </Container>
  );
}

export default TogetherBoardDetailPage;
