import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Container, Button, Alert } from "react-bootstrap";
import BoardCategoryBar from "../../components/board/BoardCategoryBar";
import { BoardSearchBar } from "../../components/board/BoardSearchBar";
import TogetherBoardList from "../../components/together/TogetherBoardList";
import MarketBoardList from "../../components/together/MarketBoardList";
import { allTogetherPosts } from "./togetherData";
import { BOARD_TABS } from "./constants";

function TogetherPage() {
  const { category = "GATHERING" } = useParams(); // URL 파라미터, 기본값 GATHERING
  const navigate = useNavigate();

  // URL 파라미터에 따라 탭 이동
  const handleTabClick = (tabId) => {
    navigate(`/together/${tabId}`);
  };

  // 현재 카테고리에 맞는 게시글 필터링
  const filteredPosts = allTogetherPosts.filter(
    (post) => post.boardType === category
  );

  const renderContent = () => {
    if (category === "MARKET") {
      return <MarketBoardList posts={filteredPosts} />;
    }
    return <TogetherBoardList posts={filteredPosts} />;
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>함께해요</h2>
        <Button
          as={Link}
          to={`/together/${category.toLowerCase()}/write`}
          variant="primary"
        >
          글쓰기
        </Button>
      </div>

      <BoardCategoryBar
        tabs={BOARD_TABS}
        activeTab={category}
        onTabClick={handleTabClick}
      />

      <BoardSearchBar />

      <div className="mt-4">{renderContent()}</div>
    </Container>
  );
}

export default TogetherPage;
