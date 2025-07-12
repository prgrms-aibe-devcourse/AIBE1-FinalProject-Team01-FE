import React, {useState} from "react";
import { useAuth } from "../../context/AuthContext";
import {isAuthor, isAuthorByNickname} from "../../utils/auth";
import UserInfo from "../common/UserInfo";
import InfoPostInfo from "../info/InfoPostInfo";
import "../../styles/components/common/PostInfoHeader.css";
import { BOARD_TYPE_LABEL } from "../../pages/community/constants";

/**
 * @typedef {Object} BoardPostHeaderProps
 * @property {object} post - The post data object.
 * @property {string} [categoryLabel] - The label for the category to display.
 * @property {() => void} onEdit - Function to handle edit action.
 * @property {() => void} onDelete - Function to handle delete action.
 * @property {boolean} [showStatus=true] - Whether to show the status badge.
 */

/**
 * 게시글 상단 정보 공통 컴포넌트
 * @param {BoardPostHeaderProps} props
 */
export const BoardPostHeader = ({
  post,
  categoryLabel,
  onEdit,
  onDelete,
  showStatus = true,
    isDeleting
}) => {
  const { user: currentUser } = useAuth();
    const canEditOrDelete = currentUser && isAuthorByNickname(currentUser.nickname, post.user.nickname);

  const user =
    post.user ||
    (post.nickname && post.profileImageUrl
      ? {
          nickname: post.nickname,
          profileImageUrl: post.profileImageUrl,
          devcourseName: post.devcourseName,
          devcourseBatch: post.devcourseBatch,
        }
      : null);

  const status = post.gathering_post?.status || post.market_item?.status;

  const getStatusBadgeClass = () => {
    if (!status) return "d-none";
    if (["모집중", "판매중", "매칭가능"].includes(status)) {
      return "bg-dark"; // 진행중 상태
    }
    return "bg-secondary"; // 완료 상태
  };

  const { devcourseName, devcourseBatch, boardType } = post;

  const isInfoBoard = boardType === "REVIEW" || boardType === "NEWS";

    return (
        <div className="post-info-header">
            {boardType && (
                <p className="post-category-label">
                    {BOARD_TYPE_LABEL[boardType] || boardType}
                </p>
            )}
            {isInfoBoard ? (
                <>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <h1 className="post-info-title mb-0">{post.title}</h1>
                        {canEditOrDelete && (
                            <div className="hub-post-actions">
                                <button
                                    className="btn btn-sm btn-link text-muted p-1"
                                    onClick={onEdit}
                                    title="수정"
                                >
                                    <i className="bi bi-pencil-square fs-5"></i>
                                </button>
                                <button
                                    className="btn btn-sm btn-link text-muted p-1"
                                    onClick={onDelete}
                                    disabled={isDeleting}
                                    title={isDeleting ? "삭제 중..." : "삭제"}
                                >
                                    {isDeleting ? (
                                        <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="visually-hidden">삭제 중...</span>
                                        </div>
                                    ) : (
                                        <i className="bi bi-trash fs-5"></i>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="d-flex justify-content-between align-items-center text-muted small mb-2">
                        <div className="d-flex align-items-center gap-2">
                            {devcourseName && devcourseBatch && (
                                <InfoPostInfo
                                    devcourseName={devcourseName}
                                    devcourseBatch={devcourseBatch}
                                    nickname={user?.nickname}
                                    boardType={boardType}
                                />
                            )}
                        </div>
                        <div>
              <span>
                {post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString()
                    : ""}
              </span>
                            <span className="mx-1">|</span>
                            <span>조회 {post.viewCount ?? 0}</span>
                        </div>
                    </div>
                </>
            ) : (
                <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                {showStatus && status && (
                                    <span className={`badge me-2 mb-2 ${getStatusBadgeClass()}`}>
                    {status}
                  </span>
                                )}
                                <h1 className="post-info-title mb-0">{post.title}</h1>
                            </div>
                            {canEditOrDelete && (
                                <div className="hub-post-actions">
                                    <button
                                        className="btn btn-sm btn-link text-muted p-1"
                                        onClick={onEdit}
                                        title="수정"
                                    >
                                        <i className="bi bi-pencil-square fs-5"></i>
                                    </button>
                                    <button
                                        className="btn btn-sm btn-link text-muted p-1"
                                        onClick={onDelete}
                                        disabled={isDeleting}
                                        title={isDeleting ? "삭제 중..." : "삭제"}
                                    >
                                        {isDeleting ? (
                                            <div className="spinner-border spinner-border-sm" role="status">
                                                <span className="visually-hidden">삭제 중...</span>
                                            </div>
                                        ) : (
                                            <i className="bi bi-trash fs-5"></i>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="d-flex w-100 justify-content-between align-items-center mt-2">
                            <div className="d-flex align-items-center gap-2">
                                {user?.profileImageUrl && (
                                    <img
                                        src={user.profileImageUrl}
                                        alt="프로필"
                                        className="author-img"
                                    />
                                )}
                                <span className="author-name fw-bold">{user?.nickname}</span>
                                {devcourseName && (
                                    <span className="author-batch">{devcourseName}</span>
                                )}
                            </div>
                            <div className="d-flex align-items-center gap-2 text-muted small">
                <span>
                  {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString()
                      : ""}
                </span>
                                <span className="mx-1">|</span>
                                <span>조회 {post.viewCount ?? 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <hr />
        </div>
    );
};