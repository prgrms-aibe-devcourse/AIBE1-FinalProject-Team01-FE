import React from "react";
import { useClipboard } from "../../hooks/useClipboard";
import LikeButton from "../common/LikeButton";
import BookmarkButton from "../common/BookmarkButton";
import ShareButton from "../common/ShareButton";
import ReportButton from "../common/ReportButton";
import {submitReport} from "../../services/reportApi.js";

/**
 * @typedef {Object} BoardTagShareBarProps
 * @property {string[]} [tags=[]]
 * @property {number} [likes=0]
 * @property {boolean} [isLiked=false]
 * @property {number} [bookmarks=0]
 * @property {boolean} [isBookmarked=false]
 * @property {() => void} [onLikeToggle]
 * @property {() => void} [onBookmarkToggle]
 */

/**
 * 태그 및 공유/좋아요/북마크 버튼 바 컴포넌트 (상태 없음)
 * @param {BoardTagShareBarProps} props
 */
export const BoardTagShareBar = ({
  tags = [],
  likes = 0,
  isLiked = false,
  bookmarks = 0,
  isBookmarked = false,
  onLikeToggle,
  onBookmarkToggle,
  postId,
  isMyPost = false,

}) => {
  const { copy } = useClipboard();

    const handlePostReport = async (reportData) => {
        try {
            const result = await submitReport(reportData);
        } catch (error) {
            throw error;
        }
    };

  const handleShare = () => {
    copy(window.location.href);
    alert("URL이 복사되었습니다!");
  };

  return (
    <div className="d-flex justify-content-between align-items-center py-3 my-3">
      <div className="d-flex flex-wrap gap-2 tags-container">
        {tags.map((tag, idx) => (
          <span className="badge bg-light text-dark rounded-pill" key={idx}>
            #{tag}
          </span>
        ))}
      </div>
      <div className="d-flex align-items-center gap-3">
        {onLikeToggle && (
          <LikeButton liked={isLiked} count={likes} onClick={onLikeToggle} />
        )}
        {onBookmarkToggle && (
          <BookmarkButton
            bookmarked={isBookmarked}
            count={bookmarks}
            onClick={onBookmarkToggle}
          />
        )}
        <ShareButton onClick={handleShare} />
          {!isMyPost && (
              <ReportButton
                  targetId={postId}
                  reportTarget="POST"
                  onReportSubmit={handlePostReport}
              />
          )}
      </div>
    </div>
  );
};
