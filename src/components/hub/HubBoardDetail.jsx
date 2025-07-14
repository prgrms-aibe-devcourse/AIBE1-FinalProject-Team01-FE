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
      <HubPostInfo post={post} />
      <PostContent post={post} stripImages={true} />
    </BoardDetailLayout>
  );
};
