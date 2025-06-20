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
      type="button"
      className={`btn-share ${className}`}
      style={style}
      onClick={onClick}
      aria-label="공유하기"
    >
      <i className="bi bi-share"></i>
      <span className="ms-1">{children}</span>
    </button>
  );
}
