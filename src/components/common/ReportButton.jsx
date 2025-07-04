import React from "react";

/**
 * @typedef {Object} ReportButtonProps
 * @property {function} onClick - 신고 버튼 클릭 핸들러
 * @property {string} [className] - 추가 CSS 클래스
 * @property {object} [style] - 인라인 스타일
 * @property {React.ReactNode} [children] - 버튼 텍스트 (기본: "신고하기")
 * @property {boolean} [disabled] - 버튼 비활성화 여부
 * @property {'sm'|'lg'} [size] - 버튼 크기
 */

/**
 * 신고 버튼 공통 컴포넌트
 * 공유하기 버튼과 동일한 스타일로 제작
 * @param {ReportButtonProps} props
 */
export default function ReportButton({
  onClick,
  className = "",
  style = {},
  children = "신고하기",
  disabled = false,
  size = ""
}) {
  const buttonClass = `btn btn-outline-secondary d-flex align-items-center gap-1 ${
    size ? `btn-${size}` : ""
  } ${className}`.trim();

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      style={style}
      disabled={disabled}
    >
      <i className="bi bi-flag"></i>
      <span>{children}</span>
    </button>
  );
}