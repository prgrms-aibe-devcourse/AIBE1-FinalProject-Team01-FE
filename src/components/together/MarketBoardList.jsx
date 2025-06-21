import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/together/market.css";

/**
 * @typedef {Object} MarketBoardListProps
 * @property {Array<Object>} posts
 * @property {(postId: number) => void} onPostClick
 */

/**
 * 함께해요-장터 탭의 카드형 게시글 리스트
 * @param {MarketBoardListProps} props
 */
export const MarketBoardList = ({ posts }) => {
  const navigate = useNavigate();

  const handleCardClick = (postId) => {
    navigate(`/together/market/${postId}`);
  };

  if (!posts || posts.length === 0) {
    return <p>해당 카테고리의 게시글이 없습니다.</p>;
  }

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
      {posts.map((post) => (
        <div key={post.id} className="col">
          <div
            className="card h-100 market-card"
            onClick={() => handleCardClick(post.id)}
          >
            <div className="market-card-img-wrapper">
              {post.images && post.images.length > 0 ? (
                <img
                  src={post.images[0]}
                  alt={post.title}
                  className="market-card-img"
                />
              ) : (
                <div className="d-flex justify-content-center align-items-center h-100 bg-light text-secondary">
                  <span>No Image</span>
                </div>
              )}
              <span
                className={`badge market-status-badge ${
                  post.status === "판매중" ? "bg-dark" : "bg-secondary"
                }`}
              >
                {post.status}
              </span>
            </div>
            <div className="card-body">
              <h5 className="card-title text-truncate">{post.title}</h5>
              <p className="card-text fw-bold">
                {post.price?.toLocaleString()}원
              </p>
              <p className="card-text text-muted small text-truncate">
                {post.location}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
