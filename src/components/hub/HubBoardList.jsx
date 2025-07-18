import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/hub/hub.css";
import { formatDate } from "../../utils/date";

/**
 * @typedef {Object} HubBoardListProps
 * @property {Array<Object>} posts
 */

export default function HubBoardList({ posts = [] }) {
  const navigate = useNavigate();

  const handleCardClick = (projectId) => {
    navigate(`/hub/${projectId}`);
  };

  if (!Array.isArray(posts) || posts.length === 0) {
    return <p className="text-center my-5">프로젝트가 없습니다.</p>;
  }

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {posts.map((post) => {
        if (!post) return null;
        const {
          projectId,
          postId,
          thumbnailImageUrl,
          tags,
          courseName,
          batchNumber,
          title,
          simpleContent,
          projectMembers,
          startedAt,
          endedAt,
          githubUrl,
          demoUrl,
          likeCount,
        } = post;

        function processTagsString(tags) {
          if (!tags || typeof tags !== 'string') {
            return [];
          }

          return tags
              .split(',')
              .map(tag => tag.trim())
              .filter(tag => tag.length > 0);
        }

        const validTags = processTagsString(tags);

        return (
          <div key={postId} className="col">
            <div
              className="card h-100 hub-card"
              onClick={() => handleCardClick(projectId)}
            >
              <div className="hub-card-img-wrapper">
                <img
                  src={thumbnailImageUrl}
                  alt={title}
                  className="hub-card-img"
                />
                <span className="hub-card-likes">
                  <i className="bi bi-star-fill"></i> {likeCount || 0}
                </span>
              </div>
              <div className="card-body d-flex flex-column">
                <p className="card-text text-primary small fw-bold">
                  {courseName} {batchNumber}기
                </p>
                <h5 className="card-title fw-bold text-truncate mt-1">
                  {title}
                </h5>
                <p className="card-text text-muted mt-2 flex-grow-1">
                  {simpleContent}
                </p>
                <p className="card-text small mt-2">
                  <strong>팀원:</strong>{" "}
                  {projectMembers && projectMembers.length > 0
                    ? projectMembers.map((m) => m.name || m).join(", ")
                    : "-"}
                </p>
                <p className="card-text small text-muted">
                  <strong>기간:</strong> {formatDate(startedAt)} ~ {formatDate(endedAt)}
                </p>
                <div className="hub-card-tags mt-auto pt-3">
                  {validTags?.map((tag, i) => (
                    <span
                      key={i}
                      className="badge rounded-pill bg-light text-dark"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="card-footer hub-card-footer">
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-dark btn-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <i className="bi bi-github"></i> GitHub
                  </a>
                )}
                {demoUrl && (
                  <a
                    href={demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-dark btn-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <i className="bi bi-globe"></i> Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
