import React from "react";
import { useNavigate } from "react-router-dom";
import {MARKET_STATUS_LABELS, STATUS_COLOR_MAP} from "../../pages/together/constants";
import "../../styles/components/together/market.css";

/**
 * @typedef {Object} MarketBoardListProps
 * @property {Array<Object>} posts
 */

/**
 * 중고장터 카드형 게시글 리스트
 * @param {MarketBoardListProps} props
 */
const MarketBoardList = ({ posts }) => {
  const navigate = useNavigate();

  const handleCardClick = (postId) => {
    navigate(`/together/market/${postId}`);
  };

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
      {posts.map((post) => {
        // 최신 구조: post.price, post.status, post.place, post.nickname, post.profileImg, post.postId, post.title, post_images 등
        const {
          thumbnail,
          nickname,
          profileImg,
          title,
          price,
          status,
        } = post;
        return (
          <div key={post.id} className="col">
            <div
              className="card h-100 market-card"
              onClick={() => handleCardClick(post.id)}
            >
              <div className="market-card-img-wrapper">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={title}
                    className="market-card-img"
                  />
                ) : (
                  <div className="d-flex justify-content-center align-items-center h-100 bg-light text-secondary">
                    <span>No Image</span>
                  </div>
                )}
                <span
                  className={`badge market-status-badge ${
                      STATUS_COLOR_MAP[MARKET_STATUS_LABELS[status]]
                  }`}
                >
                  {MARKET_STATUS_LABELS[status]}
                </span>
              </div>
              <div className="card-body">
                <h5 className="card-title text-truncate">{title}</h5>
                <p className="card-text fw-bold">{price?.toLocaleString()}원</p>
                <div className="d-flex align-items-center gap-2">
                  {profileImg && (
                    <img
                      src={profileImg}
                      alt={nickname}
                      className="rounded-circle"
                      style={{ width: 24, height: 24 }}
                    />
                  )}
                  <span className="card-text text-muted small text-truncate">
                    {nickname || "판매자"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MarketBoardList;
