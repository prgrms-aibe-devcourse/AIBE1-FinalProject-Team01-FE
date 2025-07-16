import React, {useState} from "react";
import { useAuth } from "../../context/AuthContext";
import {isAuthor, isAuthorByNickname} from "../../utils/auth";
import UserInfo from "../common/UserInfo";
import InfoPostInfo from "../info/InfoPostInfo";
import "../../styles/components/common/PostInfoHeader.css";
import { BOARD_TYPE_LABEL } from "../../pages/community/constants";
import UserInfoModal from "../user/UserInfoModal";
import {STATUS_COLOR_MAP, STATUS_LABELS} from "../../pages/together/constants.js";
import masseukiImg from "../../assets/masseuki.png";

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
    isDeleting,
    statusBadge
}) => {
  const { user: currentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const user = post.user ||
    (post.nickname ? {
          nickname: post.nickname,
          profileImageUrl: post.profileImageUrl,
          devcourseName: post.devcourseName,
          devcourseBatch: post.devcourseBatch,
        }
      : null);
    const canEditOrDelete = currentUser && isAuthorByNickname(currentUser.nickname, user?.nickname);
    const status = post.status || post.status;

  const { devcourseName, devcourseBatch, boardType, isBlinded } = post;

    return (
        <div className="post-info-header">
            {boardType && (
                <p className="post-category-label">
                    {BOARD_TYPE_LABEL[boardType] || boardType}
                </p>
            )}
            {categoryLabel && (
                <p className="post-category-label">
                    {BOARD_TYPE_LABEL[categoryLabel]}
                </p>
            )}
                <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="d-flex align-items-center gap-2">
                                <h1 className="post-info-title mb-0">{post.title}</h1>
                                {statusBadge ? (
                                    statusBadge
                                ) : (
                                    showStatus && status && STATUS_LABELS[status] && (
                                        <span className={`badge ${STATUS_COLOR_MAP[STATUS_LABELS[status]] || 'bg-secondary'}`}>
                                            {STATUS_LABELS[status]}
                                        </span>
                                    )
                                )}
                            </div>
                            {canEditOrDelete && (
                                <div className="hub-post-actions">
                                    {!isBlinded && (
                                        <button
                                            className="btn btn-sm btn-link text-muted p-1"
                                            onClick={onEdit}
                                            title="수정"
                                        >
                                            <i className="bi bi-pencil-square fs-5"></i>
                                        </button>
                                    )}
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
                                <img
                                        src={user?.profileImageUrl || masseukiImg}
                                    alt="프로필"
                                    className="author-img"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setShowModal(true)}
                                />
                                <span
                                    className="author-name fw-bold"
                                    onClick={() => setShowModal(true)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {user?.nickname}
                                </span>
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
            <hr />
            {/* 사용자 정보 모달 */}
            <UserInfoModal
                show={showModal}
                onHide={() => setShowModal(false)}
                nickname={user?.nickname}
                currentUser = {currentUser}
            />
        </div>
    );
};
