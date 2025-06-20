import React from "react";
import { useLikeBookmark } from "../../hooks/useLikeBookmark";
import { useClipboard } from "../../hooks/useClipboard";
import LikeButton from "../common/LikeButton";
import BookmarkButton from "../common/BookmarkButton";
import ShareButton from "../common/ShareButton";

/**
 * @typedef {Object} CommunityTagShareBarProps
 * @property {string[]} tags
 * @property {number} likes
 * @property {boolean} [bookmarked]
 * @property {number} [bookmarkCount]
 */

/**
 * 태그 및 공유/좋아요/북마크 버튼 컴포넌트
 * @param {CommunityTagShareBarProps} props
 */
export default function CommunityTagShareBar({
  tags,
  likes = 0,
  bookmarked = false,
  bookmarkCount = 0,
}) {
  const {
    liked,
    likeCount,
    toggleLike,
    bookmarked: isBookmarked,
    bookmarkCount: bmCount,
    toggleBookmark,
  } = useLikeBookmark({
    initialLikeCount: likes,
    initialLiked: false,
    initialBookmarkCount: bookmarkCount,
    initialBookmarked: bookmarked,
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
          bookmarked={isBookmarked}
          count={bmCount}
          onClick={toggleBookmark}
        />
        <ShareButton onClick={handleShare} />
      </div>
    </div>
  );
}
