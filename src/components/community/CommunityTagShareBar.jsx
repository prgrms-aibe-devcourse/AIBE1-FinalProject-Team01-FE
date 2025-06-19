import React from "react";

/**
 * @typedef {Object} CommunityTagShareBarProps
 * @property {string[]} tags
 * @property {number} likes
 */

/**
 * 태그 및 공유/좋아요/북마크 버튼 컴포넌트
 * @param {CommunityTagShareBarProps} props
 */
export default function CommunityTagShareBar({ tags, likes }) {
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert("URL이 복사되었습니다!");
    } else {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = window.location.href;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      alert("URL이 복사되었습니다!");
    }
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
        <button className="btn-like">
          <i className="bi bi-heart"></i> {likes}
        </button>
        <button className="btn-bookmark">북마크</button>
        <button className="btn-share" onClick={handleShare}>
          공유하기
        </button>
      </div>
    </div>
  );
}
