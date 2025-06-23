import React from "react";

/**
 * @typedef {Object} ShareButtonProps
 * @property {function} onClick
 * @property {string} [className]
 * @property {object} [style]
 * @property {React.ReactNode} [children]
 */

/**
 * 공유 버튼 공통 컴포넌트
 * @param {ShareButtonProps} props
 */
export default function ShareButton({
  onClick,
  className = "",
  style = {},
  children = "공유하기",
}) {
  return (
    <button
      className="btn btn-outline-secondary d-flex align-items-center gap-1"
      onClick={onClick}
    >
      <i className="bi bi-share"></i>
      <span>{children}</span>
    </button>
  );
}
