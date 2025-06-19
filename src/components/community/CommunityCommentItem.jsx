import React, { useState } from "react";
import { useLike } from "../../hooks/useLike";
import { useInput } from "../../hooks/useInput";

/**
 * @typedef {Object} CommunityCommentItemProps
 * @property {object} comment
 * @property {function} [onReplyAdd]
 * @property {function} [onLike]
 * @property {boolean} [liked]
 */

function CommunityCommentItem(props) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const {
    value: replyContent,
    onChange: onReplyChange,
    reset: resetReply,
  } = useInput("");
  const { liked, likeCount, toggleLike } = useLike(
    props.comment.likes,
    props.comment.liked
  );

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
      <div className="comment-content">{props.comment.content}</div>
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
      {props.comment.replies && props.comment.replies.length > 0 && (
        <div className="comment-replies">
          {props.comment.replies
            .slice()
            .sort((a, b) => a.id - b.id)
            .map((reply) => (
              <CommunityCommentItem
                key={reply.id}
                comment={reply}
                onReplyAdd={props.onReplyAdd}
                onLike={props.onLike}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export default CommunityCommentItem;
