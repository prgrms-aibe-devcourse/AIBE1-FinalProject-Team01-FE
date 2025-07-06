import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HubPostInfo } from "./HubPostInfo";
import { PostContent } from "../common/PostContent";
import { BoardDetailLayout } from "../board/BoardDetailLayout";
import "../../styles/components/hub/hub.css";
import { BOARD_TYPE_LABEL } from "../../pages/community/constants";

/**
 * @typedef {Object} HubBoardDetailProps
 * @property {object} post
 * @property {() => void} [onLike]
 * @property {() => void} [onBookmark]
 * @property {number} [likeCount]
 * @property {boolean} [isLiked]
 * @property {number} [bookmarkCount]
 * @property {boolean} [isBookmarked]
 */

/**
 * 프로젝트 허브 상세 페이지
 * @param {HubBoardDetailProps} props
 */
export const HubBoardDetail = ({
  post,
  onLike,
  onBookmark,
  likeCount,
  isLiked,
  bookmarkCount,
  isBookmarked,
}) => {
  const navigate = useNavigate();
  const { postImages, projectId, title } = post;
  const [mainImage, setMainImage] = useState(postImages?.[0]?.imageUrl || null);

  const handleEdit = () => {
    console.log("수정 기능은 현재 비활성화되어 있습니다.");
  };

  const handleDelete = () => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      console.log("삭제할 게시글 ID:", projectId);
      alert("게시글이 삭제되었습니다.");
      navigate(`/hub`);
    }
  };

  return (
    <BoardDetailLayout
      post={post}
      likeCount={likeCount}
      isLiked={isLiked}
      onLike={onLike}
      bookmarkCount={bookmarkCount}
      isBookmarked={isBookmarked}
      onBookmark={onBookmark}
    >
      {post.boardType && (
        <p className="post-category-label mb-2">
          {BOARD_TYPE_LABEL[post.boardType] || post.boardType}
        </p>
      )}
      <HubPostInfo post={post} onEdit={handleEdit} onDelete={handleDelete} />
      <div className="row g-5 mt-1">
        <div className="col-md-5">
          {postImages && postImages.length > 0 && (
            <>
              <img
                src={mainImage}
                alt={title}
                className="img-fluid rounded hub-detail-main-image mb-3"
              />
              {postImages.length > 1 && (
                <div className="d-flex flex-wrap gap-2">
                  {postImages.map((image, index) => (
                    <img
                      key={index}
                      src={image.imageUrl}
                      alt={`${title} thumbnail ${index + 1}`}
                      className={`rounded hub-detail-thumbnail ${
                        mainImage === image.imageUrl ? "active" : ""
                      }`}
                      onClick={() => setMainImage(image.imageUrl)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <div className="col-md-7">
          <PostContent post={post} stripImages={true} />
        </div>
      </div>
    </BoardDetailLayout>
  );
};
