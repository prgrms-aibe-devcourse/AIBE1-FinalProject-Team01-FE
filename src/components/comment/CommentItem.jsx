import React, { useState } from "react";
import { useLikeBookmark } from "../../hooks/useLikeBookmark";
import { useInput } from "../../hooks/useInput";
import { isAuthor } from "../../utils/auth";

/**
 * @typedef {Object} CommentItemProps
 * @property {object} comment
 * @property {function} [onReplyAdd]
 * @property {function} [onLike]
 * @property {function} [onDelete]
 * @property {function} [onEdit]
 * @property {number} [depth]
 * @property {object} user
 * @property {Array} [allComments]
 */

const CommentItem = (props) => {
  const { comment, user: currentUser, allComments = [] } = props;
  const {
    id,
    postId,
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
  const [isEditing, setIsEditing] = useState(false);
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
    toggleLike,
  } = useLikeBookmark({
    initialLikeCount: likeCount,
    initialLiked: hasLiked,
  });
  const depth = props.depth || 1;
  // 댓글 작성자 판별 (userId 기준)
  const isMine = currentUser && currentUser.userId === userId;

  // 대댓글 추출 (parentCommentId === 현재 댓글 id)
  const commentReplies = allComments.filter((c) => c.parentCommentId === id);
  const showRepliesForThis = depth === 1 ? showReplies : true;

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    if (props.onReplyAdd) {
      props.onReplyAdd(id, replyContent);
    }
    resetReply();
    setShowReplyInput(false);
  };

  const handleLikeClick = () => {
    toggleLike();
    if (props.onLike) {
      props.onLike(id);
    }
  };

  const handleEditClick = () => {
    setEditValue(initialContent);
    setIsEditing(true);
  };

  const handleEditSave = () => {
    if (props.onEdit) {
      props.onEdit(id, editContent);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      if (props.onDelete) {
        props.onDelete(id);
      }
    }
  };

  return (
    <div className="community-detail-comment-item">
      <div className="comment-author-row">
        <img
          src={profileImageUrl}
          alt="프로필"
          className="comment-author-img"
        />
        <div className="d-flex align-items-center w-100">
          <div className="d-flex align-items-center flex-grow-1">
            <span className="comment-author-name">{nickname}</span>
          </div>
          <span className="comment-date">
            {new Date(createdAt).toLocaleString()}
          </span>
        </div>
      </div>
      <div className="comment-content">
        {isEditing ? (
          <div className="d-flex align-items-center">
            <input
              type="text"
              className="form-control me-2"
              value={editContent}
              onChange={onEditChange}
              autoFocus
            />
            <button
              className="btn btn-primary btn-sm me-2 flex-shrink-0"
              onClick={handleEditSave}
            >
              저장
            </button>
            <button
              className="btn btn-secondary btn-sm flex-shrink-0"
              onClick={() => setIsEditing(false)}
            >
              취소
            </button>
          </div>
        ) : (
          initialContent
        )}
      </div>
      <div className="comment-actions">
        <button className="btn-comment-like" onClick={handleLikeClick}>
          <i
            className={liked ? "bi bi-heart-fill text-danger" : "bi bi-heart"}
          ></i>{" "}
          {likeCountState}
        </button>
        <button
          className="btn-comment-reply"
          onClick={() => setShowReplyInput((v) => !v)}
        >
          답글
        </button>
        {isMine && (
          <>
            <button
              className="btn btn-link btn-sm text-secondary ms-2"
              onClick={handleEditClick}
            >
              수정
            </button>
            <button
              className="btn btn-link btn-sm text-danger ms-1"
              onClick={handleDelete}
            >
              삭제
            </button>
          </>
        )}
        {depth === 1 && commentReplies.length > 0 && !showReplies && (
          <button
            className="btn btn-link btn-sm text-primary ms-2"
            style={{ textDecoration: "underline" }}
            onClick={() => setShowReplies(true)}
          >
            답글 보기({commentReplies.length})
          </button>
        )}
        {depth === 1 && showReplies && commentReplies.length > 0 && (
          <button
            className="btn btn-link btn-sm text-secondary mt-1 ms-2"
            style={{ textDecoration: "underline" }}
            onClick={() => setShowReplies(false)}
          >
            답글 숨기기
          </button>
        )}
      </div>
      {showReplyInput && (
        <form
          className="comment-reply-form d-flex mt-2"
          onSubmit={handleReplySubmit}
        >
          <input
            type="text"
            className="form-control me-2"
            value={replyContent}
            onChange={onReplyChange}
            placeholder="답글을 입력하세요"
            autoFocus
          />
          <button type="submit" className="btn btn-primary btn-sm">
            등록
          </button>
        </form>
      )}
      {showRepliesForThis && commentReplies.length > 0 && (
        <div className="comment-replies">
          {commentReplies
            .slice()
            .sort((a, b) => a.id - b.id)
            .map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                user={currentUser}
                onReplyAdd={props.onReplyAdd}
                onLike={props.onLike}
                onDelete={props.onDelete}
                onEdit={props.onEdit}
                depth={depth + 1}
                allComments={allComments}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export { CommentItem };
