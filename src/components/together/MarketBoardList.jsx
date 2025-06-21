import React from "react";
import { Card } from "react-bootstrap";
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
export const MarketBoardList = ({ posts, onPostClick }) => {
  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
      {posts.map((post) => (
        <div key={post.id} className="col">
          <Card
            className="h-100 market-card"
            onClick={() => onPostClick(post.id)}
          >
            <div className="market-card-img-wrapper">
              <Card.Img
                variant="top"
                src={post.image}
                className="market-card-img"
              />
              {post.status && (
                <span
                  className={`badge market-status-badge ${
                    post.status === "판매중" ? "bg-dark" : "bg-secondary"
                  }`}
                >
                  {post.status}
                </span>
              )}
            </div>
            <Card.Body>
              <Card.Title className="fs-6 fw-bold text-truncate">
                {post.title}
              </Card.Title>
              <p className="fw-bold mb-1">{post.price?.toLocaleString()}원</p>
              <small className="text-muted">
                {post.author} • {post.time}
              </small>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
};
