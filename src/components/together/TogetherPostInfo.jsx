import React, {useState} from "react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/components/community/community.css";
import "../../styles/components/together/together.css";
import { BoardPostHeader } from "../board/BoardPostHeader";
import {updateGatheringStatus} from "../../services/together/gatheringApi.js";
import {updateMatchingStatus} from "../../services/together/matchingApi.js";
import {updateMarketStatus} from "../../services/together/marketApi.js";
import {
    GATHERING_STATUS,
    GATHERING_STATUS_LABELS,
    MARKET_STATUS, MARKET_STATUS_LABELS,
    MATCH_STATUS, MATCH_STATUS_LABELS
} from "../../pages/together/constants.js";
import {isAuthorByNickname} from "../../utils/auth.js";
import "../../styles/components/together/postinfo.css"

/**
 * @typedef {Object} TogetherPostInfoProps
 * @property {object} post - The post data object.
 * @property {() => void} [onEdit] - Function to handle edit action.
 * @property {() => void} [onDelete] - Function to handle delete action.
 */

/**
 * 함께해요 게시글 상단 정보 (스터디/프로젝트, 커피챗/멘토링)
 * @param {TogetherPostInfoProps} props
 */
const TogetherPostInfo = ({ post, onEdit, onDelete, boardType, onStatusUpdate }) => {
  const { user: currentUser } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
  const isMine = isAuthorByNickname(currentUser.nickname, post.nickname)

  if (!post) return <div>게시글 정보를 불러오는 중입니다...</div>;

  function formatPrice(price) {
    return price.toLocaleString('ko-KR') + '원';
  }

    const handleStatusUpdate = async (newStatus) => {
        if (isUpdating) return;

        try {
            setIsUpdating(true);
            setIsHovered(false); // 호버 상태 해제

            if (boardType === "gathering") {
                await updateGatheringStatus(post.id, newStatus);
            } else if (boardType === "match") {
                await updateMatchingStatus(post.id, newStatus);
            } else if (boardType === "market") {
                await updateMarketStatus(post.id, newStatus);
            }

            // 상태 업데이트 후 부모 컴포넌트에 알림
            if (onStatusUpdate) {
                onStatusUpdate(newStatus);
            }

        } catch (error) {
            console.error("상태 업데이트 실패:", error);
            alert("상태 업데이트에 실패했습니다.");
        } finally {
            setIsUpdating(false);
        }
    };

    // 현재 상태 표시
    const getCurrentStatusLabel = () => {
        if (boardType === "gathering") {
            return GATHERING_STATUS_LABELS[post.status];
        } else if (boardType === "match") {
            return MATCH_STATUS_LABELS[post.status];
        } else if (boardType === "market") {
            return MARKET_STATUS_LABELS[post.status];
        }
        return post.status;
    };

    // 상태별 가능한 변경 옵션들
    const getStatusOptions = () => {
        if (!isMine || post.isBlinded) return [];

        if (boardType === "gathering") {
            if (post.status === GATHERING_STATUS.RECRUITING) {
                return [{ status: GATHERING_STATUS.COMPLETED, label: "모집완료", icon: "bi-check-circle" }];
            }
        } else if (boardType === "match") {
            if (post.status === MATCH_STATUS.AVAILABLE) {
                return [{ status: MATCH_STATUS.COMPLETED, label: "매칭완료", icon: "bi-people-fill" }];
            }
        } else if (boardType === "market") {
            if (post.status === MARKET_STATUS.ON_SALE) {
                return [
                    { status: MARKET_STATUS.RESERVED, label: "예약중", icon: "bi-bookmark-check" },
                    { status: MARKET_STATUS.SOLD_OUT, label: "판매완료", icon: "bi-check2-circle" }
                ];
            } else if (post.status === MARKET_STATUS.RESERVED) {
                return [
                    { status: MARKET_STATUS.ON_SALE, label: "판매중", icon: "bi-arrow-counterclockwise" },
                    { status: MARKET_STATUS.SOLD_OUT, label: "판매완료", icon: "bi-check2-circle" }
                ];
            }
        }

        return [];
    };

    // 상태별 뱃지 색상
    const getBadgeClass = () => {
        if (boardType === "gathering") {
            return post.status === GATHERING_STATUS.RECRUITING ?
                "badge bg-success" : "badge bg-secondary";
        } else if (boardType === "match") {
            return post.status === MATCH_STATUS.AVAILABLE ?
                "badge bg-primary" : "badge bg-secondary";
        } else if (boardType === "market") {
            if (post.status === MARKET_STATUS.RESERVED) return "badge bg-success";
            if (post.status === MARKET_STATUS.ON_SALE) return "badge bg-secondary text-white";
            return "badge bg-secondary";
        }
        return "badge bg-secondary";
    };

    // 호버 가능한 상태 뱃지 컴포넌트
    const StatusBadge = () => {
        const options = getStatusOptions();
        const hasOptions = options.length > 0;

        return (
            <div
                className="status-badge-container"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
        <span className={`${getBadgeClass()} ${hasOptions ? 'status-badge-hoverable' : ''}`}>
          {isUpdating ? (
              <>
                  <i className="bi bi-arrow-repeat me-1 spin-animation"></i>
                  업데이트 중...
              </>
          ) : (
              <>
                  {getCurrentStatusLabel()}
                  {hasOptions && <i className="bi bi-chevron-down ms-1 small"></i>}
              </>
          )}
        </span>
                {hasOptions && isHovered && !isUpdating && (
                    <div className="status-options-dropdown">
                        <div className="dropdown-bridge"></div>
                        <div className="dropdown-content">
                            <div className="status-options-header">
                                <i className="bi bi-gear me-1"></i>
                                상태 변경
                            </div>
                            {options.map((option, index) => (
                                <button
                                    key={index}
                                    className="status-option-btn"
                                    onClick={() => handleStatusUpdate(option.status)}
                                >
                                    <i className={`${option.icon} me-2`}></i>
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

  // GATHERING(스터디/프로젝트)
  if (boardType === "gathering") {
    return (
        <>
          <BoardPostHeader
              post={post}
              boardType={boardType}
              onEdit={isMine ? onEdit : undefined}
              onDelete={isMine ? onDelete : undefined}
              categoryLabel = {post.gatheringType}
              statusBadge={<StatusBadge />}
          />
          {!post.isBlinded && (
              <div className="d-flex flex-wrap justify-content-around align-items-center p-3 my-4 rounded bg-light">
                <div className="text-center mx-2 my-2">
                  <h6 className="text-muted mb-1">모집인원</h6>
                  <p className="m-0 fw-bold">
                    <i className="bi bi-people-fill me-1"></i>
                    {post.headCount}명
                  </p>

                </div>
                <div className="text-center mx-2 my-2">
                  <h6 className="text-muted mb-1">기간</h6>
                  <p className="m-0 fw-bold">
                    <i className="bi bi-calendar-check me-1"></i>
                    {post.period}
                  </p>
                </div>
                <div className="text-center mx-2 my-2">
                  <h6 className="text-muted mb-1">장소</h6>
                  <p className="m-0 fw-bold">
                    <i className="bi bi-geo-alt me-1"></i>
                    {post.place}
                  </p>
                </div>
                <div className="text-center mx-2 my-2">
                  <h6 className="text-muted mb-1">일정</h6>
                  <p className="m-0 fw-bold">
                    <i className="bi bi-clock me-1"></i>
                    {post.schedule}
                  </p>
                </div>
              </div>
          )}
        </>
    );
  }

  // MATCH(커피챗/멘토링)
  if (boardType === "match") {
    return (
        <>
          <BoardPostHeader
              post={post}
              boardType={boardType}
              onEdit={isMine ? onEdit : undefined}
              onDelete={isMine ? onDelete : undefined}
              categoryLabel = {post.matchingType}
              statusBadge={<StatusBadge />}
          />
          {!post.isBlinded && (
              <div className="d-flex flex-wrap justify-content-around align-items-center p-3 my-4 rounded bg-light">
                <div className="text-center mx-2 my-2">
                  <h6 className="text-muted mb-1">전문 분야</h6>
                  <p className="m-0 fw-bold">
                    <i className="bi bi-person-badge me-1"></i>
                    {post.expertiseArea}
                  </p>
                </div>
                <div className="text-center mx-2 my-2">
                  <h6 className="text-muted mb-1">장소</h6>
                  <p className="m-0 fw-bold">
                    <i className="bi bi-geo-alt me-1"></i>
                    {post.place || "온라인"}
                  </p>
                </div>
                {post.schedule && (
                    <div className="text-center mx-2 my-2">
                      <h6 className="text-muted mb-1">일정</h6>
                      <p className="m-0 fw-bold">
                        <i className="bi bi-clock me-1"></i>
                        {post.schedule}
                      </p>
                    </div>
                )}
              </div>
          )}
        </>
    );
  }

  if (boardType === "market") {
    return (
        <>
          <BoardPostHeader
              post={post}
              boardType={boardType}
              onEdit={isMine ? onEdit : undefined}
              onDelete={isMine ? onDelete : undefined}
              categoryLabel={"MARKET"}
              statusBadge={<StatusBadge />}
          />
          {!post.isBlinded && (
              <div className="d-flex flex-wrap justify-content-around align-items-center p-3 my-4 rounded bg-light">
                <div className="text-center mx-2 my-2">
                  <h6 className="text-muted mb-1">가격</h6>
                  <p className="m-0 fw-bold">
                    <i className="bi bi-wallet me-1"></i>
                    {formatPrice(post.price)}
                  </p>
                </div>
                <div className="text-center mx-2 my-2">
                  <h6 className="text-muted mb-1">장소</h6>
                  <p className="m-0 fw-bold">
                    <i className="bi bi-geo-alt me-1"></i>
                    {post.place || "택배"}
                  </p>
                </div>
              </div>
          )}
        </>
    );
  }
};

export default TogetherPostInfo;
