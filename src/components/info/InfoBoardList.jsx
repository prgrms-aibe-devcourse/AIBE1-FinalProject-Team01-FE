import React from "react";
import InfoPostCard from "./InfoPostCard";
import "../../styles/components/community/community.css";
import "../../styles/components/info/info.css";

export default function InfoBoardList({ posts, onPostClick }) {
  return (
    <div className="d-flex flex-column gap-3 community-board-list">
      {posts.map((post) => {
        let categoryLabel = undefined;
        let categoryKey = undefined;
        if (post.boardType === "REVIEW") {
          categoryLabel = post.devcourseName;
          categoryKey = post.devcourseName;
        }
        // NEWS는 라벨 없음
        return (
          <InfoPostCard
            key={post.postId}
            post={post}
            onClick={onPostClick ? () => onPostClick(post.postId) : undefined}
            categoryLabel={categoryLabel}
            categoryKey={categoryKey}
          />
        );
      })}
    </div>
  );
}
