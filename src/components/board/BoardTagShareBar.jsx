import React from "react";
import { useLikeBookmark } from "../../hooks/useLikeBookmark";
import { useClipboard } from "../../hooks/useClipboard";
import LikeButton from "../common/LikeButton";
import BookmarkButton from "../common/BookmarkButton";
import ShareButton from "../common/ShareButton";

/**
 * @typedef {Object} BoardTagShareBarProps
 * @property {string[]} tags
 * @property {number} likes
 * @property {boolean} [bookmarked]
 * @property {number} [bookmarkCount]
 * @property {() => void} [onBookmarkToggle]
 */

/**
 * 태그 및 공유/좋아요/북마크 버튼 컴포넌트
 * @param {BoardTagShareBarProps} props
 */
export const BoardTagShareBar = ({
  tags = [],
  likes = 0,
  bookmarked: initialBookmarked = false,
  bookmarkCount: initialBookmarkCount = 0,
  onBookmarkToggle,
}) => {
  const { liked, likeCount, toggleLike } = useLikeBookmark({
    initialLikeCount: likes,
    initialLiked: false, // initialLiked는 항상 false로 시작
  });
  const { copy } = useClipboard();

  const handleShare = () => {
    copy(window.location.href);
    alert("URL이 복사되었습니다!");
  };

  return (
    <div className="community-detail-tagshare">
      <div className="community-detail-tags">
        {tags.map((tag, idx) => (
          <span className="community-detail-tag" key={idx}>
            {tag}
          </span>
        ))}
      </div>
      <div className="community-detail-sharebar">
        <LikeButton liked={liked} count={likeCount} onClick={toggleLike} />
        <BookmarkButton
          bookmarked={initialBookmarked}
          count={initialBookmarkCount}
          onClick={onBookmarkToggle}
        />
        <ShareButton onClick={handleShare} />
      </div>
    </div>
  );
};
