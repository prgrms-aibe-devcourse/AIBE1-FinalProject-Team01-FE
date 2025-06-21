import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MarketPostInfo } from "./MarketPostInfo";
import CommunityPostContent from "../community/CommunityPostContent";
import { BoardDetailLayout } from "../common/BoardDetailLayout";
import "../../styles/together/market.css";

/**
 * @typedef {Object} MarketBoardDetailProps
 * @property {object} post
 */

/**
 * 장터 글 상세 메인 컴포넌트
 * @param {MarketBoardDetailProps} props
 */
export const MarketBoardDetail = ({ post }) => {
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState(post.images?.[0] || null);

  const handleEdit = () => {
    navigate(`/together/${post.category}/write`, {
      state: { postToEdit: post },
    });
  };

  const handleDelete = () => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      console.log("삭제할 게시글 ID:", post.id);
      alert("게시글이 삭제되었습니다.");
      navigate(`/together/${post.category}`);
    }
  };

  return (
    <BoardDetailLayout post={post}>
      <MarketPostInfo post={post} onEdit={handleEdit} onDelete={handleDelete} />
      <div className="row g-5 mt-3">
        <div className="col-md-5">
          {post.images && post.images.length > 0 && (
            <>
              <img
                src={mainImage}
                alt={post.title}
                className="img-fluid rounded market-detail-image mb-3"
              />
              {post.images.length > 1 && (
                <div className="d-flex flex-wrap gap-2">
                  {post.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${post.title} thumbnail ${index + 1}`}
                      className={`rounded market-detail-thumbnail ${
                        mainImage === img ? "active" : ""
                      }`}
                      onClick={() => setMainImage(img)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <div className="col-md-7">
          <CommunityPostContent post={post} stripImages={true} />
        </div>
      </div>
    </BoardDetailLayout>
  );
};
