import React from "react";
import "../../styles/components/community/community.css";
import "../../styles/components/together/together.css";
import { BoardPostHeader } from "../board/BoardPostHeader";

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
const TogetherPostInfo = ({ post, onEdit, onDelete }) => {
  if (!post) return <div>게시글 정보를 불러오는 중입니다...</div>;

  // GATHERING(스터디/프로젝트)
  if (post.boardType === "GATHERING") {
    return (
      <>
        <BoardPostHeader
          post={post}
          onEdit={onEdit}
          onDelete={onDelete}
          categoryLabel={post.gatheringType}
        />
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
      </>
    );
  }

  // MATCH(커피챗/멘토링)
  if (post.boardType === "MATCH") {
    return (
      <>
        <BoardPostHeader
          post={post}
          onEdit={onEdit}
          onDelete={onDelete}
          categoryLabel={post.matchingType}
        />
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
      </>
    );
  }

  // 기타(boardType이 없거나 MARKET 등)
  return null;
};

export default TogetherPostInfo;
