import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { isAuthor } from "../../utils/auth";
import "../../styles/components/community/community.css";
import { BoardPostHeader } from "../board/BoardPostHeader";

/**
 * @typedef {Object} MarketPostInfoProps
 * @property {object} post - The post data object.
 * @property {() => void} onEdit - Function to handle edit action.
 * @property {() => void} onDelete - Function to handle delete action.
 */

/**
 * 장터 게시글 상단 정보 (고유 정보 포함)
 * @param {MarketPostInfoProps} props
 */
export const MarketPostInfo = ({ post, onEdit, onDelete }) => {
  const { user: currentUser } = useAuth();
  const canEditOrDelete = isAuthor(currentUser, post.user_id);
  const { market_item } = post;

  if (!market_item) {
    return <div>게시글 정보를 불러오는 중입니다...</div>;
  }

  return (
    <>
      <BoardPostHeader post={post} onEdit={onEdit} onDelete={onDelete} />
      <div className="d-flex align-items-center justify-content-around p-3 rounded bg-light">
        <div className="text-center">
          <h6 className="text-muted mb-1">가격</h6>
          <h4 className="fw-bold m-0">
            {market_item.price?.toLocaleString()}원
          </h4>
        </div>
        <div className="text-center">
          <h6 className="text-muted mb-1">판매 상태</h6>
          <p className="m-0">
            <i
              className={`bi ${
                market_item.status === "판매중" ? "bi-cart-check" : "bi-cart-x"
              } me-1`}
            ></i>
            {market_item.status}
          </p>
        </div>
      </div>
    </>
  );
};
