import React from "react";
import { useAuth } from "../../context/AuthContext";
import { isAuthor } from "../../utils/auth";
import "../../styles/components/community/community.css";
import { PostInfoHeader } from "../common/PostInfoHeader";

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
  const { user } = useAuth();
  const canEditOrDelete = isAuthor(user, post.authorId);

  return (
    <>
      <PostInfoHeader
        post={post}
        onEdit={onEdit}
        onDelete={onDelete}
        categoryLabel={post.categoryLabel}
      />
      <div className="d-flex align-items-center justify-content-around p-3 rounded bg-light">
        <div className="text-center">
          <h6 className="text-muted mb-1">가격</h6>
          <h4 className="fw-bold m-0">{post.price?.toLocaleString()}원</h4>
        </div>
        <div className="text-center">
          <h6 className="text-muted mb-1">거래 장소</h6>
          <p className="m-0">
            <i className="bi bi-geo-alt me-1"></i>
            {post.location || "온라인/직거래"}
          </p>
        </div>
      </div>
    </>
  );
};
