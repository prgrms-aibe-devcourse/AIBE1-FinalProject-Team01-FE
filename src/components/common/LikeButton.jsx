import React from "react";

/**
 * @typedef {Object} LikeButtonProps
 * @property {boolean} liked
 * @property {number} count
 * @property {function} onClick
 * @property {string} [className]
 * @property {object} [style]
 */

/**
 * 좋아요(하트) 버튼 공통 컴포넌트
 * @param {LikeButtonProps} props
 */
export default function LikeButton({
  liked,
  count,
  onClick,
  className = "",
  style = {},
}) {
  return (
    <button
      type="button"
      className={`btn-like ${className}`}
      style={style}
      onClick={onClick}
      aria-label="좋아요"
    >
      <i className={liked ? "bi bi-heart-fill text-danger" : "bi bi-heart"}></i>{" "}
      {count}
    </button>
  );
}
