import React from "react";
import PostCard from "../board/PostCard";
import MarketPostInfo from "./MarketPostInfo";

/**
 * @typedef {Object} TogetherBoardListProps
 * @property {Array<Object>} posts
 */

/**
 * 함께해요 게시글 리스트 (스터디/프로젝트, 커피챗/멘토링, 중고장터)
 * @param {TogetherBoardListProps} props
 */
const TogetherBoardList = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return <div className="text-center py-5">게시글이 없습니다.</div>;
  }

  return (
    <div className="d-flex flex-column gap-3">
      {posts.map((post) => {
        if (post.boardType === "MARKET") {
          // 별도 : 갤러리용
          return <MarketPostInfo key={post.postId} post={post} />;
        }
        // 공통 : postCard
        return <PostCard key={post.postId} post={post} />;
      })}
    </div>
  );
};

export default TogetherBoardList;
