import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Button, Spinner, Alert } from "react-bootstrap";
import BoardCategoryBar from "../../components/board/BoardCategoryBar";
import { BoardSearchBar } from "../../components/board/BoardSearchBar";
import TogetherBoardList from "../../components/together/TogetherBoardList";
import { allTogetherPosts } from "./togetherData";
import { BOARD_TABS } from "./constants";

function TogetherPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // TODO: API 연동
    try {
      setLoading(true);
      setPosts(allTogetherPosts);
      setError(null);
    } catch (err) {
      setError("게시글을 불러오는 데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const filteredPosts = posts.filter((post) => {
    // 탭 필터링
    if (activeTab !== "all" && post.boardType !== activeTab) {
      return false;
    }
    return true;
  });

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
    return <TogetherBoardList posts={filteredPosts} />;
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>함께해요</h2>
        <Button as={Link} to="/together/write" variant="primary">
          글쓰기
        </Button>
      </div>

      <BoardCategoryBar
        tabs={BOARD_TABS}
        activeTab={activeTab}
        onTabClick={handleTabClick}
      />

      <BoardSearchBar />

      <div className="mt-4">{renderContent()}</div>
    </Container>
  );
}

export default TogetherPage;
