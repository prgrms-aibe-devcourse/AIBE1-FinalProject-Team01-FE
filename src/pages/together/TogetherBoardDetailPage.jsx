import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Spinner, Alert } from "react-bootstrap";
import TogetherBoardDetail from "../../components/together/TogetherBoardDetail";
import MarketBoardDetail from "../../components/together/MarketBoardDetail";
import { allTogetherPosts } from "./togetherData";
import { useLikeBookmark } from "../../hooks/useLikeBookmark";
import { getGatheringPostDetail } from "../../services/together/gatheringApi";
import { getMatchingPostDetail } from "../../services/together/matchingApi";
import { getMarketPostDetail } from "../../services/together/marketApi";

function TogetherBoardDetailPage() {
  const { postId, boardType } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function changeTagToList(tag) {
    if (!tag) return [];
    return tag.split(",").map((item) => item.trim());
  };

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (boardType === "GATHERING") {
          data = await getGatheringPostDetail(postId);
        } else if (boardType === "MATCH") {
          data = await getMatchingPostDetail(postId);
        } else if (boardType === "MARKET") {
          data = await getMarketPostDetail(postId);
        } else {
          throw new Error("Unknown board type: " + boardType);
        }
        data.tags = changeTagToList(data.tags);
        setPost(data);
      } catch (err) {
        console.error(err);
        setError("게시글을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
      fetchPost();
  }, [boardType, postId]);

  const {
    liked,
    likeCount,
    toggleLike,
    bookmarked,
    bookmarkCount,
    toggleBookmark,
  } = useLikeBookmark({
    initialLikeCount: post?.likeCount ?? 0,
    initialLiked: post?.hasLiked ?? false,
    initialBookmarkCount: post?.bookmarkCount ?? 0,
    initialBookmarked: post?.hasBookmarked ?? false,
    postId: post?.postId,
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
      {boardType === "MARKET" ? (
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
          boardType={boardType}
        />
      )}
    </Container>
  );
}

export default TogetherBoardDetailPage;
