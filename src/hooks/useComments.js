import { useState, useCallback, useEffect, useRef } from "react";
import { commentApi } from "../services/commentApi";
import { useAuth } from "../context/AuthContext";

export const useComments = (postId, initialSize = 10) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [repliesData, setRepliesData] = useState({});
  const [repliesLoading, setRepliesLoading] = useState({});

  const { user } = useAuth();
  const loadingRef = useRef(false); // 중복 로딩 방지용 ref
  const initialLoadRef = useRef(false); // 초기 로딩 완료 추적용 ref

  /**
   * 댓글 목록 조회
   */
  const loadComments = useCallback(async (cursor = null, size = initialSize) => {
    // 중복 로딩 방지
    if (loadingRef.current) {
      console.log('이미 로딩 중이므로 요청 무시');
      return;
    }

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await commentApi.getComments(postId, cursor, size);
      console.log(response)

      if (cursor) {
        // 추가 로드
        setComments(prev => [...prev, ...response.comments]);
      } else {
        // 초기 로드
        setComments(response.comments);
        setInitialLoaded(true);
        initialLoadRef.current = true;
      }

      setNextCursor(response.nextCursor);
      setHasNext(response.hasNext);
    } catch (err) {
      setError(err.message || '댓글을 불러오는 중 오류가 발생했습니다.');
      setInitialLoaded(true);
      initialLoadRef.current = true;
      console.error('댓글 로드 실패:', err);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [postId, initialSize]);

  /**
   * 더 많은 댓글 로드
   */
  const loadMoreComments = useCallback(() => {
    if (hasNext && nextCursor && !loadingRef.current) {
      loadComments(nextCursor, initialSize);
    }
  }, [hasNext, nextCursor, loadComments]);

  /**
   * 대댓글 로드
   */
  const loadReplies = useCallback(async (commentId, cursor = null, size = 5) => {
    if (repliesLoading[commentId]) return;

    setRepliesLoading(prev => ({ ...prev, [commentId]: true }));

    try {
      const response = await commentApi.getReplies(postId, commentId, cursor, size);

      setRepliesData(prev => {
        const existingReplies = prev[commentId]?.comments || [];
        const newReplies = cursor ? [...existingReplies, ...response.comments] : response.comments;

        return {
          ...prev,
          [commentId]: {
            comments: newReplies,
            nextCursor: response.nextCursor,
            hasNext: response.hasNext
          }
        };
      });
    } catch (err) {
      console.error('대댓글 로드 실패:', err);
    } finally {
      setRepliesLoading(prev => ({ ...prev, [commentId]: false }));
    }
  }, [postId]);

  /**
   * 더 많은 대댓글 로드
   */
  const loadMoreReplies = useCallback((commentId) => {
    const replyData = repliesData[commentId];
    if (replyData?.hasNext && replyData?.nextCursor && !repliesLoading[commentId]) {
      loadReplies(commentId, replyData.nextCursor, 5);
    }
  }, [repliesData, repliesLoading, loadReplies]);

  /**
   * 댓글 작성
   */
  const handleCommentAdd = useCallback(async (content) => {
    if (!content.trim()) return;

    try {
      const newComment = await commentApi.createComment(postId, { content });

      // 더보기가 모두 완료된 상태(!hasNext)인 경우에만 UI에 바로 추가
      if (!hasNext) {
        setComments(prev => [...prev, newComment]); // 맨 아래 추가 (역순이므로)
      }
      // hasNext가 true면 새 댓글은 서버에서 다음 로드 시 나타남

      return newComment;
    } catch (err) {
      console.error('댓글 작성 실패:', err);
      throw new Error(err.message || '댓글 작성 중 오류가 발생했습니다.');
    }
  }, [postId, hasNext]);

  /**
   * 대댓글 작성
   */
  const handleReplyAdd = useCallback(async (parentCommentId, content) => {
    if (!content.trim()) return;

    try {
      const newReply = await commentApi.createComment(postId, {
        content,
        parentCommentId
      });

      // 해당 댓글의 대댓글이 모두 로드된 상태에서만 UI에 바로 추가
      const parentRepliesData = repliesData[parentCommentId];
      if (parentRepliesData && !parentRepliesData.hasNext) {
        setRepliesData(prev => {
          const existingData = prev[parentCommentId] || { comments: [], hasNext: false, nextCursor: null };
          return {
            ...prev,
            [parentCommentId]: {
              ...existingData,
              comments: [...existingData.comments, newReply] // 맨 아래 추가
            }
          };
        });
      }

      // 부모 댓글의 replyCount는 항상 증가
      setComments(prev => prev.map(comment =>
          comment.id === parentCommentId
              ? { ...comment, replyCount: (comment.replyCount || 0) + 1 }
              : comment
      ));

      return newReply;
    } catch (err) {
      console.error('대댓글 작성 실패:', err);
      throw new Error(err.message || '대댓글 작성 중 오류가 발생했습니다.');
    }
  }, [postId, repliesData]);

  /**
   * 댓글 수정
   */
  const handleCommentEdit = useCallback(async (commentId, content, isReply = false, parentCommentId = null) => {
    if (!content.trim()) return;

    try {
      await commentApi.updateComment(postId, commentId, { content });

      if (isReply && parentCommentId) {
        setRepliesData(prev => ({
          ...prev,
          [parentCommentId]: {
            ...prev[parentCommentId],
            comments: prev[parentCommentId].comments.map(reply =>
                reply.id === commentId
                    ? { ...reply, content, updatedAt: new Date().toISOString() }
                    : reply
            )
          }
        }));
      } else {
        setComments(prev => prev.map(comment =>
            comment.id === commentId
                ? { ...comment, content, updatedAt: new Date().toISOString() }
                : comment
        ));
      }
    } catch (err) {
      console.error('댓글 수정 실패:', err);
      throw new Error(err.message || '댓글 수정 중 오류가 발생했습니다.');
    }
  }, [postId]);

  /**
   * 댓글 삭제
   */
  const handleCommentDelete = useCallback(async (commentId, isReply = false, parentCommentId = null) => {
    try {
      await commentApi.deleteComment(postId, commentId);

      if (isReply && parentCommentId) {
        setRepliesData(prev => ({
          ...prev,
          [parentCommentId]: {
            ...prev[parentCommentId],
            comments: prev[parentCommentId].comments.filter(reply => reply.id !== commentId)
          }
        }));

        setComments(prev => prev.map(comment =>
            comment.id === parentCommentId
                ? { ...comment, replyCount: Math.max((comment.replyCount || 0) - 1, 0) }
                : comment
        ));
      } else {
        setComments(prev => prev.filter(comment => comment.id !== commentId));

        setRepliesData(prev => {
          const newData = { ...prev };
          delete newData[commentId];
          return newData;
        });
      }
    } catch (err) {
      console.error('댓글 삭제 실패:', err);
      throw new Error(err.message || '댓글 삭제 중 오류가 발생했습니다.');
    }
  }, [postId]);

  /**
   * 댓글 새로고침
   */
  const refreshComments = useCallback(() => {
    setComments([]);
    setRepliesData({});
    setNextCursor(null);
    setHasNext(false);
    setInitialLoaded(false);
    initialLoadRef.current = false;
    loadComments();
  }, [loadComments]);

  /**
   * 초기 데이터 로드 - postId가 변경될 때만 실행
   */
  useEffect(() => {
    if (postId && !initialLoadRef.current) {
      console.log('초기 댓글 로드 시작:', postId);
      loadComments();
    }
  }, [postId]); // loadComments 의존성 제거

  /**
   * postId가 변경되면 상태 초기화
   */
  useEffect(() => {
    setComments([]);
    setRepliesData({});
    setNextCursor(null);
    setHasNext(false);
    setInitialLoaded(false);
    setError(null);
    initialLoadRef.current = false;
    loadingRef.current = false;
  }, [postId]);

  return {
    // 상태
    comments,
    setComments,
    loading,
    initialLoaded,
    error,
    hasNext,
    repliesData,
    repliesLoading,

    // 함수들
    handleCommentAdd,
    handleReplyAdd,
    handleCommentEdit,
    handleCommentDelete,
    loadComments,
    loadMoreComments,
    loadReplies,
    loadMoreReplies,
    refreshComments,
  };
};