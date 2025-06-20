import React from "react";
import { useLike } from "../../hooks/useLike";
import { useClipboard } from "../../hooks/useClipboard";

/**
 * @typedef {Object} CommunityTagShareBarProps
 * @property {string[]} tags
 * @property {number} likes
 * @property {boolean} [bookmarked]
 * @property {number} [bookmarkCount]
 * @property {function} [onBookmarkToggle]
 */

/**
 * 태그 및 공유/좋아요/북마크 버튼 컴포넌트
 * @param {CommunityTagShareBarProps} props
 */
export default function CommunityTagShareBar({
  tags,
  likes,
  bookmarked,
  bookmarkCount,
  onBookmarkToggle,
}) {
  const { liked, likeCount, toggleLike } = useLike(likes, false);
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
        {/* TODO: 좋아요/북마크/공유 기능 연동 */}
        <button className="btn-like" onClick={toggleLike}>
          <i
            className={liked ? "bi bi-heart-fill text-danger" : "bi bi-heart"}
          ></i>{" "}
          {likeCount}
        </button>
        <button className="btn-bookmark" onClick={onBookmarkToggle}>
          <i
            className={
              bookmarked ? "bi bi-bookmark-fill text-warning" : "bi bi-bookmark"
            }
          ></i>
          <span className="ms-1 small">{bookmarkCount}</span>
        </button>
        <button className="btn-share" onClick={handleShare}>
          공유하기
        </button>
      </div>
    </div>
  );
}
