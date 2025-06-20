import React from "react";

/**
 * @typedef {Object} BookmarkButtonProps
 * @property {boolean} bookmarked
 * @property {number} count
 * @property {function} onClick
 * @property {string} [className]
 * @property {object} [style]
 */

/**
 * 북마크(즐겨찾기) 버튼 공통 컴포넌트
 * @param {BookmarkButtonProps} props
 */
export default function BookmarkButton({
  bookmarked,
  count,
  onClick,
  className = "",
  style = {},
}) {
  return (
    <button
      type="button"
      className={`btn-bookmark ${className}`}
      style={style}
      onClick={onClick}
      aria-label="북마크"
    >
      <i
        className={
          bookmarked ? "bi bi-bookmark-fill text-warning" : "bi bi-bookmark"
        }
      ></i>
      <span className="ms-1 small">{count}</span>
    </button>
  );
}
