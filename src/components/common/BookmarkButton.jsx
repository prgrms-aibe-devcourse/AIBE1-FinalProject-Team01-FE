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
      className="btn btn-outline-secondary d-flex align-items-center gap-1"
      onClick={onClick}
    >
      <i className={bookmarked ? "bi bi-bookmark-fill" : "bi bi-bookmark"}></i>
      <span>{count}</span>
    </button>
  );
}
