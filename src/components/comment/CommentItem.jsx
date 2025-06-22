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
 */

export const CommentItem = (props) => {
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
  } = useInput(props.comment.content);
  const { liked, likeCount, toggleLike } = useLikeBookmark({
    initialLikeCount: props.comment.likes,
    initialLiked: props.comment.liked,
  });
  const depth = props.depth || 1;
  const { user } = props;
  const isMine = isAuthor(user, props.comment.authorId);

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    if (props.onReplyAdd) {
      props.onReplyAdd(props.comment.id, replyContent);
    }
    resetReply();
    setShowReplyInput(false);
  };

  const handleLikeClick = () => {
    toggleLike();
    if (props.onLike) {
      props.onLike(props.comment.id);
    }
  };

  const handleEditClick = () => {
    setEditValue(props.comment.content);
    setIsEditing(true);
  };

  const handleEditSave = () => {
    if (props.onEdit) {
      props.onEdit(props.comment.id, editContent);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      if (props.onDelete) {
        props.onDelete(props.comment.id);
      }
    }
  };

  const replies = Array.isArray(props.comment.replies)
    ? props.comment.replies
    : [];
  const showRepliesForThis = depth === 1 ? showReplies : true;

  return (
    <div className="community-detail-comment-item">
      <div className="comment-author-row">
        <img
          src={props.comment.authorProfileImg}
          alt="프로필"
          className="comment-author-img"
        />
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="d-flex align-items-center">
            <span className="comment-author-name">{props.comment.author}</span>
            {props.comment.devcourseName && (
              <span className="comment-author-batch text-primary ms-2">
                {props.comment.devcourseName}
              </span>
            )}
          </div>
          <span className="comment-date">{props.comment.date}</span>
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
          props.comment.content
        )}
      </div>
      <div className="comment-actions">
        <button className="btn-comment-like" onClick={handleLikeClick}>
          <i
            className={liked ? "bi bi-heart-fill text-danger" : "bi bi-heart"}
          ></i>{" "}
          {likeCount}
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
        {depth === 1 && replies.length > 0 && !showReplies && (
          <button
            className="btn btn-link btn-sm text-primary ms-2"
            style={{ textDecoration: "underline" }}
            onClick={() => setShowReplies(true)}
          >
            답글 보기({replies.length})
          </button>
        )}
        {depth === 1 && showReplies && replies.length > 0 && (
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
      {showRepliesForThis && replies.length > 0 && (
        <div className="comment-replies">
          {replies
            .slice()
            .sort((a, b) => a.id - b.id)
            .map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                user={user}
                onReplyAdd={props.onReplyAdd}
                onLike={props.onLike}
                onDelete={props.onDelete}
                onEdit={props.onEdit}
                depth={depth + 1}
              />
            ))}
        </div>
      )}
    </div>
  );
};
