import React from "react";
import { useLikeBookmark } from "../../hooks/useLikeBookmark";

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
const LikeButton = ({ liked, count, onClick }) => {
  return (
    <button
      className="btn btn-outline-secondary d-flex align-items-center gap-1"
      onClick={onClick}
    >
      <i className={liked ? "bi bi-heart-fill text-danger" : "bi bi-heart"}></i>
      <span>{count}</span>
    </button>
  );
};

export default LikeButton;
