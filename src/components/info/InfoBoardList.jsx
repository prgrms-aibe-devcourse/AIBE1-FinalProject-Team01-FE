import React from "react";
import InfoPostCard from "./InfoPostCard";
import { INFO_CATEGORY_LABELS } from "../../pages/info/constants";

export default function InfoBoardList({ posts, category, onPostClick }) {
  return (
    <div className="d-flex flex-column gap-3">
      {posts.map((post) => (
        <InfoPostCard
          key={post.id}
          post={post}
          categoryLabel={INFO_CATEGORY_LABELS[category]}
          categoryKey={category}
          onClick={onPostClick ? () => onPostClick(post.id) : undefined}
        />
      ))}
    </div>
  );
}
