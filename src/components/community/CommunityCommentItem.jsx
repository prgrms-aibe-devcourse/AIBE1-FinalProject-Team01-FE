import React, { useState } from "react";
import { useLike } from "../../hooks/useLike";
import { useInput } from "../../hooks/useInput";

/**
 * @typedef {Object} CommunityCommentItemProps
 * @property {object} comment
 * @property {function} [onReplyAdd]
 * @property {function} [onLike]
 * @property {function} [onDelete]
 * @property {function} [onEdit]
 * @property {boolean} [liked]
 * @property {number} [depth]
 */

function CommunityCommentItem(props) {
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
    reset: resetEdit,
    setValue: setEditValue,
  } = useInput(props.comment.content);
  const { liked, likeCount, toggleLike } = useLike(
    props.comment.likes,
    props.comment.liked
  );
  const depth = props.depth || 1;

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    if (props.onReplyAdd) {
      props.onReplyAdd(props.comment.id, replyContent);
    }
    resetReply();
    setShowReplyInput(false);
  };

  // 좋아요 버튼 클릭 핸들러
  const handleLikeClick = () => {
    toggleLike();
    if (props.onLike) {
      props.onLike(props.comment.id);
      // TODO: 백엔드에 좋아요/취소 요청 보내기
    }
  };

  // 수정 버튼 클릭 시
  const handleEditClick = () => {
    setEditValue(props.comment.content);
    setIsEditing(true);
  };

  // 수정 저장
  const handleEditSave = () => {
    if (props.onEdit) {
      props.onEdit(props.comment.id, editContent);
      // TODO: 백엔드에 수정 요청 보내기
    }
    setIsEditing(false);
  };

  // 삭제
  const handleDelete = () => {
    if (props.onDelete) {
      props.onDelete(props.comment.id);
      // TODO: 백엔드에 삭제 요청 보내기
    }
  };

  // 답글(대댓글) 렌더링 로직
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
          <>
            <input
              type="text"
              className="form-control me-2"
              value={editContent}
              onChange={onEditChange}
              autoFocus
            />
            <button
              className="btn btn-primary btn-sm me-2"
              onClick={handleEditSave}
            >
              저장
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsEditing(false)}
            >
              취소
            </button>
          </>
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
        {/* 답글 보기/숨기기 버튼은 depth=1(최상위 댓글)에서만 노출 */}
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
      {/* 답글 입력창 */}
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
      {/* 대댓글 */}
      {showRepliesForThis && replies.length > 0 && (
        <div className="comment-replies">
          {replies
            .slice()
            .sort((a, b) => a.id - b.id)
            .map((reply) => (
              <CommunityCommentItem
                key={reply.id}
                comment={reply}
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
}

export default CommunityCommentItem;
