import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MarketPostInfo from "./MarketPostInfo";
import { PostContent } from "../common/PostContent";
import { BoardTagShareBar } from "../board/BoardTagShareBar";
import { BoardDetailLayout } from "../board/BoardDetailLayout";
import "../../styles/components/together/market.css";

/**
 * @typedef {Object} MarketBoardDetailProps
 * @property {object} post
 * @property {boolean} [liked]
 * @property {number} [likeCount]
 * @property {function} [onLike]
 * @property {boolean} [bookmarked]
 * @property {number} [bookmarkCount]
 * @property {function} [onBookmark]
 */

/**
 * 중고장터 글 상세 메인 컴포넌트
 * @param {MarketBoardDetailProps} props
 */
const MarketBoardDetail = ({
  post,
  liked,
  likeCount,
  onLike,
  bookmarked,
  bookmarkCount,
  onBookmark,
}) => {
  const navigate = useNavigate();
  const { post_images } = post;
  const [mainImage, setMainImage] = useState(
    post_images?.[0]?.image_url || null
  );

  const handleEdit = () => {
    navigate(`/together/${post.boardType.toLowerCase()}/write`, {
      state: { postToEdit: post },
    });
  };

  const handleDelete = () => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      console.log("삭제할 게시글 ID:", post.postId);
      alert("게시글이 삭제되었습니다.");
      navigate(`/together/${post.boardType.toLowerCase()}`);
    }
  };

  return (
    <BoardDetailLayout post={post} boardTitle="함께해요" boardLink="/together">
      <MarketPostInfo post={post} onEdit={handleEdit} onDelete={handleDelete} />
      <div className="row g-5 mt-3">
        <div className="col-md-5">
          {post_images && post_images.length > 0 && (
            <>
              <img
                src={mainImage}
                alt={post.title}
                className="img-fluid rounded market-detail-image mb-3"
              />
              {post_images.length > 1 && (
                <div className="d-flex flex-wrap gap-2">
                  {post_images.map((image, index) => (
                    <img
                      key={index}
                      src={image.image_url}
                      alt={`${post.title} thumbnail ${index + 1}`}
                      className={`rounded market-detail-thumbnail ${
                        mainImage === image.image_url ? "active" : ""
                      }`}
                      onClick={() => setMainImage(image.image_url)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <div className="col-md-7">
          <PostContent post={post} stripImages={true} />
          <BoardTagShareBar
            tags={post.tags}
            likes={likeCount}
            isLiked={liked}
            bookmarks={bookmarkCount}
            isBookmarked={bookmarked}
            onLikeToggle={onLike}
            onBookmarkToggle={onBookmark}
          />
        </div>
      </div>
    </BoardDetailLayout>
  );
};

export default MarketBoardDetail;
