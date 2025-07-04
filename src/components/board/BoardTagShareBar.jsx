import React, { useState } from "react";
import { useLikeBookmark } from "../../hooks/useLikeBookmark";
import { useClipboard } from "../../hooks/useClipboard";
import LikeButton from "../common/LikeButton";
import BookmarkButton from "../common/BookmarkButton";
import ShareButton from "../common/ShareButton";
import ReportButton from "../common/ReportButton";
import ReportModal from "../common/ReportModal";
import { Toast, ToastContainer } from "react-bootstrap";

/**
 * @typedef {Object} BoardTagShareBarProps
 * @property {string[]} tags
 * @property {number} likes
 * @property {boolean} [bookmarked]
 * @property {number} [bookmarkCount]
 * @property {() => void} [onBookmarkToggle]
 * @property {number} postId - 게시글 ID (신고용)
 */

/**
 * 태그 및 공유/좋아요/북마크/신고 버튼 컴포넌트
 * @param {BoardTagShareBarProps} props
 */
export const BoardTagShareBar = ({
                                   tags = [],
                                   likes = 0,
                                   bookmarked: initialBookmarked = false,
                                   bookmarkCount: initialBookmarkCount = 0,
                                   onBookmarkToggle,
                                   postId,
                                 }) => {
  const { liked, likeCount, toggleLike } = useLikeBookmark({
    initialLikeCount: likes,
    initialLiked: false,
  });
  const { copy } = useClipboard();

  // 신고 모달 관련 state
  const [showReportModal, setShowReportModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  const handleShare = () => {
    copy(window.location.href);
    alert("URL이 복사되었습니다!");
  };

  // 신고 버튼 클릭 핸들러
  const handleReport = () => {
    setShowReportModal(true);
  };

  // 신고 제출 핸들러
  const handleReportSubmit = async (reportData) => {
    try {
      // 실제 API 호출 부분
      console.log("신고 데이터:", reportData);

      // 예시 API 호출
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 인증 토큰이 필요한 경우
          // "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error("신고 처리에 실패했습니다.");
      }

      const result = await response.json();

      // 성공 토스트 표시
      setToastMessage("신고가 정상적으로 접수되었습니다.");
      setToastVariant("success");
      setShowToast(true);

    } catch (error) {
      console.error("신고 오류:", error);

      // 에러를 다시 throw하여 모달에서 처리하도록 함
      throw error;
    }
  };

  return (
      <>
        <div className="d-flex justify-content-between align-items-center py-3 my-3">
          <div className="d-flex flex-wrap gap-2 tags-container">
            {tags.map((tag, idx) => (
                <span className="badge bg-light text-dark rounded-pill" key={idx}>
              #{tag}
            </span>
            ))}
          </div>
          <div className="d-flex align-items-center gap-3">
            <LikeButton liked={liked} count={likeCount} onClick={toggleLike} />
            <BookmarkButton
                bookmarked={initialBookmarked}
                count={initialBookmarkCount}
                onClick={onBookmarkToggle}
            />
            <ShareButton onClick={handleShare} />
            <ReportButton onClick={handleReport} />
          </div>
        </div>

        {/* 신고 모달 */}
        <ReportModal
            show={showReportModal}
            onHide={() => setShowReportModal(false)}
            targetId={postId}
            reportTarget="POST"
            onSubmit={handleReportSubmit}
        />

        {/* 토스트 알림 */}
        <ToastContainer position="top-end" className="p-3">
          <Toast
              show={showToast}
              onClose={() => setShowToast(false)}
              delay={4000}
              autohide
              bg={toastVariant}
          >
            <Toast.Header>
              <strong className="me-auto">
                {toastVariant === "success" ? "성공" : "오류"}
              </strong>
            </Toast.Header>
            <Toast.Body className="text-white">
              {toastMessage}
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </>
  );
};