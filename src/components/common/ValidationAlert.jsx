import React from "react";

/**
 * @typedef {Object} ValidationAlertProps
 * @property {boolean} show - 알림 표시 여부
 * @property {string[]} errors - 에러 메시지 목록
 * @property {string} [title] - 알림 제목
 * @property {string} [variant] - 알림 스타일 (danger, warning, info)
 */

/**
 * 재사용 가능한 유효성 검사 알림 컴포넌트
 * @param {ValidationAlertProps} props
 */
export const ValidationAlert = ({ 
  show, 
  errors, 
  title = "필수 입력 항목을 확인해주세요!",
  variant = "danger"
}) => {
  if (!show || !errors || errors.length === 0) return null;

  return (
    <div className={`alert alert-${variant} mb-4`} role="alert">
      <i className="bi bi-exclamation-triangle-fill me-2"></i>
      <strong>{title}</strong>
      <ul className="mb-0 mt-2">
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
};
