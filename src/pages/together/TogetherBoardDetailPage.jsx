import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Spinner, Alert } from "react-bootstrap";
import BoardDetailLayout from "../../components/board/BoardDetailLayout";
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

  const renderBoardDetail = () => {
    if (!post) return null;

    switch (post.boardType) {
      case "GATHERING":
      case "MATCH":
        return <TogetherBoardDetail post={post} />;
      case "MARKET":
        return <MarketBoardDetail post={post} />;
      default:
        return <Alert variant="warning">알 수 없는 게시판 타입입니다.</Alert>;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }
    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }
    if (post) {
      return (
        <BoardDetailLayout
          post={post}
          boardTitle="함께해요"
          boardLink="/together"
        >
          {renderBoardDetail()}
        </BoardDetailLayout>
      );
    }
    return null;
  };

  return <Container className="py-5">{renderContent()}</Container>;
}

export default TogetherBoardDetailPage;
