import React, { useState } from "react";
import { CommentItem } from "./CommentItem";
import { useInput } from "../../hooks/useInput";
import { useAuth } from "../../context/AuthContext";
import { useComments } from "../../hooks/useComments";
import '../../styles/components/comment/CommentSection.css';

/**
 * 댓글 전체 컴포넌트 (백엔드 API 연동 - 더보기 버튼 방식)
 */
const CommentSection = ({ postId, comments: initialComments = [] }) => {
  const { value, onChange, reset } = useInput("");
  const { user } = useAuth();
  const [submitLoading, setSubmitLoading] = useState(false);

  const {
    comments,
    loading,
    initialLoaded,
    error,
    hasNext,
    repliesData,
    repliesLoading,
    handleCommentAdd,
    handleReplyAdd,
    handleCommentEdit,
    handleCommentDelete,
    loadMoreComments,
    loadReplies,
    loadMoreReplies,
  } = useComments(postId);

  /**
   * 댓글 작성 처리
   */
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!value.trim() || submitLoading) return;

    setSubmitLoading(true);
    try {
      await handleCommentAdd(value);
      reset();

      // 간단한 알림 (alert 사용)
      if (hasNext) {
        alert('댓글이 작성되었습니다. 모든 댓글을 보려면 "더 많은 댓글 보기"를 눌러주세요.');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  /**
   * 대댓글 작성 처리
   */
  const handleReplyAddWrapper = async (parentCommentId, content) => {
    try {
      await handleReplyAdd(parentCommentId, content);
    } catch (err) {
      alert(err.message);
      throw err;
    }
  };

  /**
   * 댓글 수정 처리
   */
  const handleCommentEditWrapper = async (commentId, content, isReply = false, parentCommentId = null) => {
    try {
      await handleCommentEdit(commentId, content, isReply, parentCommentId);
    } catch (err) {
      alert(err.message);
      throw err;
    }
  };

  /**
   * 댓글 삭제 처리
   */
  const handleCommentDeleteWrapper = async (commentId, isReply = false, parentCommentId = null) => {
    try {
      await handleCommentDelete(commentId, isReply, parentCommentId);
    } catch (err) {
      alert(err.message);
      throw err;
    }
  };

  /**
   * 대댓글 로드 처리
   */
  const handleLoadReplies = (commentId) => {
    loadReplies(commentId);
  };

  /**
   * 더 많은 댓글 로드
   */
  const handleLoadMore = () => {
    if (!loading && hasNext) {
      loadMoreComments();
    }
  };

  if (error) {
    return (
        <div className="community-detail-comments">
          <div className="alert alert-danger" role="alert">
            {error}
            <button
                className="btn btn-outline-danger btn-sm ms-2"
                onClick={() => window.location.reload()}
            >
              새로고침
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="community-detail-comments">
        {/* 댓글 작성 폼 */}
        <form className="community-detail-comment-form" onSubmit={handleAdd}>
          <div className="comment-form-simple">
            <textarea
                className="comment-form-textarea-simple"
                value={value}
                onChange={(e) => {
                  onChange(e);
                  // 자동 높이 조절
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (value.trim() && !submitLoading) {
                      handleAdd(e);
                    }
                  }
                }}
                placeholder="댓글을 작성하세요 (Shift + Enter로 줄바꿈)"
                disabled={submitLoading}
                rows={1}
            />
            <button
                type="submit"
                className="comment-form-submit-simple"
                disabled={submitLoading || !value.trim()}
            >
              {submitLoading ? '작성 중' : '댓글 작성'}
            </button>
          </div>
        </form>

        {/* 댓글 목록 */}
        <div className="community-detail-comment-list">
          {!initialLoaded ? (
              // 초기 로딩 중
              <div className="text-center py-4">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">댓글을 불러오는 중...</span>
                </div>
              </div>
          ) : comments.length === 0 ? (
              // 댓글이 없음
              <div className="text-center py-4 text-muted">
                아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
              </div>
          ) : (
              // 댓글 목록 표시
              <>
                {comments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        user={user}
                        postId={postId}
                        onReplyAdd={handleReplyAddWrapper}
                        onEdit={handleCommentEditWrapper}
                        onDelete={handleCommentDeleteWrapper}
                        onLoadReplies={handleLoadReplies}
                        onLoadMoreReplies={loadMoreReplies}
                        repliesData={repliesData[comment.id]}
                        repliesLoading={repliesLoading[comment.id]}
                        depth={1}
                        allComments={comments} // 기존 호환성을 위해 유지
                    />
                ))}

                {/* 더 보기 버튼 */}
                {hasNext && (
                    <div className="text-center py-4">
                      <button
                          className="btn-load-more"
                          onClick={handleLoadMore}
                          disabled={loading}
                      >
                        {loading ? (
                            <div className="load-more-loading">
                              <div className="spinner"></div>
                              <span>댓글을 불러오는 중...</span>
                            </div>
                        ) : (
                            <div className="load-more-content">
                              <svg className="load-more-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                              <span>더 많은 댓글 보기</span>
                              <div className="load-more-ripple"></div>
                            </div>
                        )}
                      </button>
                    </div>
                )}

                {/* 모든 댓글을 다 불러온 경우 */}
                {!hasNext && comments.length > 0 && (
                    <div className="text-center py-3 text-muted">
                      <small>모든 댓글을 불러왔습니다</small>
                    </div>
                )}
              </>
          )}
        </div>
      </div>
  );
};

export default CommentSection;