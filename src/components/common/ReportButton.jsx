import React, { useState } from "react";
import ReportModal from "./ReportModal";

/**
 * @typedef {Object} ReportButtonProps
 * @property {number} targetId - 신고 대상 ID (게시글 ID 또는 댓글 ID)
 * @property {'POST'|'COMMENT'} reportTarget - 신고 대상 타입
 * @property {function} [onReportSubmit] - 신고 제출 시 호출되는 콜백 함수
 * @property {string} [className] - 추가 CSS 클래스
 * @property {object} [style] - 인라인 스타일
 * @property {React.ReactNode} [children] - 버튼 텍스트 (기본: "신고하기")
 * @property {boolean} [disabled] - 버튼 비활성화 여부
 * @property {'sm'|'lg'} [size] - 버튼 크기
 */

/**
 * 신고 버튼 공통 컴포넌트 (모달 포함)
 * 버튼 클릭 시 자동으로 신고 모달이 열림
 * @param {ReportButtonProps} props
 */
export default function ReportButton({
                                       targetId,
                                       reportTarget,
                                       onReportSubmit,
                                       className = "",
                                       style = {},
                                       children = "신고하기",
                                       disabled = false,
                                       size = ""
                                     }) {
  const [showModal, setShowModal] = useState(false);

  const buttonClass = `btn btn-outline-secondary d-flex align-items-center gap-1 ${
      size ? `btn-${size}` : ""
  } ${className}`.trim();

  const handleButtonClick = () => {
    if (!disabled) {
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleReportSubmit = async (reportData) => {
    try {
      if (onReportSubmit) {
        await onReportSubmit(reportData);
      } else {
        // 기본 신고 처리 로직 (API 호출 등)
        console.log('신고 데이터:', reportData);
        alert('신고가 접수되었습니다.');
      }
      setShowModal(false);
    } catch (error) {
      console.error('신고 처리 실패:', error);
      throw error; // 모달에서 에러 처리하도록 다시 throw
    }
  };

  return (
      <>
        <button
            className={buttonClass}
            onClick={handleButtonClick}
            style={style}
            disabled={disabled}
        >
          <i className="bi bi-flag"></i>
          <span>{children}</span>
        </button>

        <ReportModal
            show={showModal}
            onHide={handleModalClose}
            targetId={targetId}
            reportTarget={reportTarget}
            onSubmit={handleReportSubmit}
        />
      </>
  );
}