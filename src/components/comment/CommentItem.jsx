import React, { useState } from "react";
import { useLikeBookmark } from "../../hooks/useLikeBookmark";
import { useInput } from "../../hooks/useInput";
import { isAuthor, isAuthorByNickname } from "../../utils/auth";
import ReportModal from "../common/ReportModal";
import { submitReport } from "../../services/reportApi.js";
import '../../styles/components/comment/CommentSection.css'
import UserInfoModal from "../user/UserInfoModal.jsx";

/**
 * @typedef {Object} CommentItemProps
 * @property {object} comment
 * @property {function} [onReplyAdd]
 * @property {function} [onLike]
 * @property {function} [onDelete]
 * @property {function} [onEdit]
 * @property {function} [onLoadReplies]
 * @property {function} [onLoadMoreReplies]
 * @property {number} [depth]
 * @property {object} user
 * @property {Array} [allComments] - 기존 호환성을 위해 유지
 * @property {string|number} postId
 * @property {object} [repliesData]
 * @property {boolean} [repliesLoading]
 */

const CommentItem = (props) => {
  const {
    comment,
    user: currentUser,
    allComments = [],
    postId,
    onLoadReplies,
    onLoadMoreReplies,
    repliesData,
    repliesLoading
  } = props;

  const {
    id,
    nickname,
    profileImageUrl,
    parentCommentId,
    content: initialContent,
    replyCount,
    likeCount,
    hasLiked,
    createdAt,
    updatedAt,
    userId,
  } = comment;

  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [replySubmitting, setReplySubmitting] = useState(false);

  const {
    value: replyContent,
    onChange: onReplyChange,
    reset: resetReply,
  } = useInput("");
  const {
    value: editContent,
    onChange: onEditChange,
    setValue: setEditValue,
  } = useInput(initialContent);
  const {
    liked,
    likeCount: likeCountState,
    toggleLikeComment,
  } = useLikeBookmark({
    initialLikeCount: likeCount,
    initialLiked: hasLiked,
    postId: postId,
    commentId: id,
  });

  const depth = props.depth || 1;

  // 댓글 작성자 판별 (userId 기준)
  const isMine = isAuthorByNickname(currentUser.nickname, comment.nickname);

  // 새로운 방식의 대댓글 데이터 사용 (repliesData가 있는 경우)
  // 없으면 기존 방식 사용 (하위 호환성)
  let commentReplies = [];
  let hasMoreReplies = false;

  if (repliesData) {
    // 새로운 API 연동 방식
    commentReplies = repliesData.comments || [];
    hasMoreReplies = repliesData.hasNext || false;
  } else {
    // 기존 방식 (allComments에서 필터링)
    commentReplies = allComments.filter((c) => c.parentCommentId === id);
  }

  const showRepliesForThis = depth === 1 ? showReplies : true;

  /**
   * 대댓글 작성
   */
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || replySubmitting) return;

    setReplySubmitting(true);
    try {
      if (props.onReplyAdd) {
        await props.onReplyAdd(id, replyContent);
      }
      resetReply();
      setShowReplyInput(false);

      // 대댓글을 작성한 후 처리
      if (!showReplies) {
        // 답글보기가 열려있지 않다면 답글을 가져오고 보여줌
        if (onLoadReplies) {
          onLoadReplies(id);
        }
        setShowReplies(true);
      }
      // showReplies가 이미 true라면 useComments에서 repliesData를 업데이트해줌
    } catch (err) {
      // 에러는 부모에서 처리됨
    } finally {
      setReplySubmitting(false);
    }
  };

  const handleLikeClick = () => {
    toggleLikeComment();
    if (props.onLike) {
      props.onLike(id);
    }
  };

  const handleEditClick = () => {
    setEditValue(initialContent);
    setIsEditing(true);
  };

  const handleEditSave = async () => {
    try {
      if (props.onEdit) {
        const isReply = depth > 1;
        const parentId = isReply ? parentCommentId : null;
        await props.onEdit(id, editContent, isReply, parentId);
      }
      setIsEditing(false);
    } catch (err) {
      // 에러는 부모에서 처리됨
    }
  };

  const handleDelete = async () => {
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      try {
        if (props.onDelete) {
          const isReply = depth > 1;
          const parentId = isReply ? parentCommentId : null;
          await props.onDelete(id, isReply, parentId);
        }
      } catch (err) {
        // 에러는 부모에서 처리됨
      }
    }
  };

  /**
   * 대댓글 보기/숨기기
   */
  const handleToggleReplies = () => {
    if (!showReplies) {
      // 처음 대댓글을 보는 경우 로드 (새로운 API 방식)
      if (onLoadReplies && commentReplies.length === 0 && replyCount > 0) {
        onLoadReplies(id);
      }
      setShowReplies(true);
    } else {
      setShowReplies(false);
    }
  };

  /**
   * 더 많은 대댓글 로드
   */
  const handleLoadMoreReplies = () => {
    if (onLoadMoreReplies) {
      onLoadMoreReplies(id);
    }
  };

  const handleReport = () => {
    setShowReportModal(true);
  };

  const handleReportSubmit = async (reportData) => {
    try {
      const result = await submitReport(reportData);
    } catch (error) {
      throw error;
    }
  };

  return (
      <div className={`community-detail-comment-item ${depth > 1 ? 'comment-reply' : ''}`}>
        <div className="comment-author-row">
          <img
              src={profileImageUrl}
              alt="프로필"
              className="comment-author-img"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowModal(true)}
          />
          <div className="d-flex align-items-center w-100">
            <div className="d-flex align-items-center flex-grow-1">
              <span 
                className="comment-author-name"
                style={{ cursor: 'pointer' }} 
                onClick={() => setShowModal(true)}
              >
                {nickname}
              </span>
            </div>
            <span className="comment-date">
            {new Date(createdAt).toLocaleString()}
          </span>
            {!isMine && (
                <button
                    className="btn btn-link btn-sm text-secondary ms-2 p-0"
                    onClick={handleReport}
                    style={{ fontSize: '13px', opacity: 0.7 }}
                >
                  <i className="bi bi-flag"></i> 신고
                </button>
            )}
          </div>
        </div>

        <div className="comment-content">
          {isEditing ? (
              <div className="edit-form-wrapper">
                <textarea
                    className="edit-form-textarea"
                    value={editContent}
                    onChange={(e) => {
                      onEditChange(e);
                      // 자동 높이 조절
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleEditSave();
                      }
                    }}
                    ref={(el) => {
                      if (el) {
                        // 렌더링 후 높이 자동 조절
                        setTimeout(() => {
                          el.style.height = 'auto';
                          el.style.height = Math.min(el.scrollHeight, 150) + 'px';
                        }, 0);
                      }
                    }}
                    autoFocus
                    rows={1}
                />
                <div className="edit-form-buttons">
                  <button
                      className="edit-form-submit"
                      onClick={handleEditSave}
                  >
                    저장
                  </button>
                  <button
                      className="edit-form-cancel"
                      onClick={() => setIsEditing(false)}
                  >
                    취소
                  </button>
                </div>
              </div>
          ) : (
              <div className="comment-text" style={{ whiteSpace: 'pre-wrap' }}>
                {initialContent}
              </div>
          )}
        </div>

        <div className="comment-actions">
          <div className="comment-actions-left">
            <button className="comment-action-btn comment-like-btn" onClick={handleLikeClick}>
              <i className={liked ? "bi bi-heart-fill" : "bi bi-heart"}></i>
              <span>{likeCountState}</span>
            </button>

            {depth === 1 && (
                <button
                    className="comment-action-btn comment-reply-btn"
                    onClick={() => setShowReplyInput(prev => !prev)}
                >
                  <i className="bi bi-reply"></i>
                  <span>답글</span>
                </button>
            )}

            {/* 대댓글 보기/숨기기 버튼 (부모 댓글만) */}
            {depth === 1 && (replyCount > 0 || (repliesData && repliesData.comments && repliesData.comments.length > 0)) && !showReplies && (
                <button
                    className="comment-action-btn comment-toggle-btn"
                    onClick={handleToggleReplies}
                    disabled={repliesLoading}
                >
                  <i className="bi bi-chat-dots"></i>
                  <span>{repliesLoading ? '로딩 중...' : `답글 보기(${replyCount})`}</span>
                </button>
            )}

            {depth === 1 && showReplies && (replyCount > 0 || (repliesData && repliesData.comments && repliesData.comments.length > 0)) && (
                <button
                    className="comment-action-btn comment-toggle-btn"
                    onClick={handleToggleReplies}
                >
                  <i className="bi bi-eye-slash"></i>
                  <span>답글 숨기기</span>
                </button>
            )}
          </div>

          {isMine && (
            <div className="comment-actions-right">
              {!comment.isBlinded && (
                  <button
                      className="comment-action-btn comment-edit-btn"
                      onClick={handleEditClick}
                  >
                    <i className="bi bi-pencil"></i>
                    <span>수정</span>
                  </button>
              )}
              <button
                  className="comment-action-btn comment-delete-btn"
                  onClick={handleDelete}
              >
                <i className="bi bi-trash"></i>
                <span>삭제</span>
              </button>
            </div>
          )}
        </div>

        {/* 대댓글 입력 폼 */}
        {showReplyInput && depth === 1 && (
            <form
                className="comment-reply-form mt-2"
                onSubmit={handleReplySubmit}
            >
              <div className="reply-form-wrapper">
                <textarea
                    className="reply-form-textarea"
                    value={replyContent}
                    onChange={(e) => {
                      onReplyChange(e);
                      // 자동 높이 조절
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (replyContent.trim() && !replySubmitting) {
                          handleReplySubmit(e);
                        }
                      }
                    }}
                    placeholder="답글을 입력하세요 (Shift + Enter로 줄바꿈)"
                    autoFocus
                    disabled={replySubmitting}
                    rows={1}
                />
                <button
                    type="submit"
                    className="reply-form-submit"
                    disabled={replySubmitting || !replyContent.trim()}
                >
                  {replySubmitting ? '등록 중' : '등록'}
                </button>
              </div>
            </form>
        )}

        {/* 대댓글 목록 */}
        {showRepliesForThis && commentReplies.length > 0 && (
            <div className="comment-replies">
              {repliesLoading && commentReplies.length === 0 ? (
                  <div className="text-center py-2">
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">대댓글을 불러오는 중...</span>
                    </div>
                  </div>
              ) : (
                  <>
                    {commentReplies
                        .slice()
                        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                        .map((reply) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                user={currentUser}
                                postId={postId}
                                onReplyAdd={props.onReplyAdd}
                                onLike={props.onLike}
                                onDelete={props.onDelete}
                                onEdit={props.onEdit}
                                depth={depth + 1}
                                allComments={allComments}
                            />
                        ))}

                    {/* 더 많은 대댓글 로드 버튼 (새로운 API 방식에서만) */}
                    {hasMoreReplies && onLoadMoreReplies && (
                        <div className="text-center py-2">
                          <button
                              className="btn-load-more-replies"
                              onClick={handleLoadMoreReplies}
                              disabled={repliesLoading}
                          >
                            {repliesLoading ? (
                                <div className="load-more-loading-small">
                                  <div className="spinner-small"></div>
                                  <span>로딩 중...</span>
                                </div>
                            ) : (
                                <div className="load-more-content-small">
                                  <svg className="load-more-icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                  <span>더 많은 답글 보기</span>
                                </div>
                            )}
                          </button>
                        </div>
                    )}
                  </>
              )}
            </div>
        )}

        {/* 신고 모달 */}
        <ReportModal
            show={showReportModal}
            onHide={() => setShowReportModal(false)}
            targetId={id}
            reportTarget="COMMENT"
            onSubmit={handleReportSubmit}
        />
        {/* 사용자 정보 모달 */}
        <UserInfoModal
        show={showModal}
        onHide={() => setShowModal(false)}
        nickname={nickname}
      />
      </div>
  );
};

export { CommentItem };
