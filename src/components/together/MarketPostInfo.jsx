import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { isAuthor } from "../../utils/auth";
import "../../styles/components/community/community.css";
import { BoardPostHeader } from "../board/BoardPostHeader";
import { MARKET_STATUS_LABELS } from "../../pages/together/constants";

/**
 * @typedef {Object} MarketPostInfoProps
 * @property {object} post - The post data object.
 * @property {() => void} [onEdit] - Function to handle edit action.
 * @property {() => void} [onDelete] - Function to handle delete action.
 */

/**
 * 중고장터 게시글 상단 정보
 * @param {MarketPostInfoProps} props
 */
const MarketPostInfo = ({ post, onEdit, onDelete }) => {
  if (!post) return <div>게시글 정보를 불러오는 중입니다...</div>;

  return (
    <>
      <BoardPostHeader
        post={post}
        onEdit={onEdit}
        onDelete={onDelete}
        categoryLabel="중고장터"
      />
      <div className="d-flex align-items-center justify-content-around p-3 rounded bg-light">
        <div className="text-center">
          <h6 className="text-muted mb-1">가격</h6>
          <h4 className="fw-bold m-0">{post.price?.toLocaleString()}원</h4>
        </div>
        <div className="text-center">
          <h6 className="text-muted mb-1">판매 상태</h6>
          <p className="m-0">
            <i
              className={`bi ${
                post.status === "ON_SALE"
                  ? "bi-cart-check"
                  : post.status === "RESERVED"
                  ? "bi-cart"
                  : "bi-cart-x"
              } me-1`}
            ></i>
            {MARKET_STATUS_LABELS[post.status]}
          </p>
        </div>
        <div className="text-center">
          <h6 className="text-muted mb-1">거래 장소</h6>
          <p className="m-0 fw-bold">
            <i className="bi bi-geo-alt me-1"></i>
            {post.place}
          </p>
        </div>
      </div>
    </>
  );
};

export default MarketPostInfo;
