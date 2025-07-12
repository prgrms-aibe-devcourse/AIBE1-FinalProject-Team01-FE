import React from "react";
import { useNavigate } from "react-router-dom";
import { PostCard } from "../board/PostCard";
import {
  GATHERING_TYPE_LABELS,
  MATCH_TYPE_LABELS,
} from "../../pages/together/constants";

/**
 * @typedef {Object} TogetherBoardListProps
 * @property {Array<Object>} posts
 */

/**
 * 함께해요 게시글 리스트 (스터디/프로젝트, 커피챗/멘토링)
 * @param {TogetherBoardListProps} props
 */
const TogetherBoardList = ({ posts, boardType }) => {
  const navigate = useNavigate();

  const handleCardClick = (post) => {
    navigate(`/together/${boardType}/${post.id}`);
  };

  if (!posts || posts.length === 0) {
    return <div className="text-center py-5">게시글이 없습니다.</div>;
  }

  return (
    <div className="d-flex flex-column gap-3">
      {posts.map((post) => {
        const categoryLabel =
          boardType === "GATHERING"
            ? GATHERING_TYPE_LABELS[post.gatheringType]
            : MATCH_TYPE_LABELS[post.matchingType];

        return (
          <PostCard
            key={post.id}
            post={post}
            categoryLabel={categoryLabel}
            categoryKey={
              post.gatheringType?.toLowerCase() ||
              post.matchingType?.toLowerCase() ||
              ""
            }
            onClick={() => handleCardClick(post)}
          />
        );
      })}
    </div>
  );
};

export default TogetherBoardList;
