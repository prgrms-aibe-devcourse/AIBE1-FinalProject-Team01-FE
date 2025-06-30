import React from "react";
import { useAuth } from "../../context/AuthContext";
import { isAuthor } from "../../utils/auth";
import "../../styles/components/hub/hub.css";

/**
 * @typedef {Object} HubPostInfoProps
 * @property {object} post - The post data object.
 * @property {() => void} onEdit - Function to handle edit action.
 * @property {() => void} onDelete - Function to handle delete action.
 */
export const HubPostInfo = ({ post, onEdit, onDelete }) => {
  const { user: currentUser } = useAuth();
  const canEditOrDelete = isAuthor(currentUser, post.userId);
  const {
    courseName,
    batchNumber,
    title,
    user,
    createdAt,
    projectMembers,
    startedAt,
    endedAt,
    tags,
    githubUrl,
    demoUrl,
  } = post;

  return (
    <div className="p-1 mt-3">
      <h1 className="fw-bold">{title}</h1>
      {canEditOrDelete && (
        <div className="d-flex gap-2 mt-2">
          <button className="btn btn-sm btn-outline-secondary" onClick={onEdit}>
            수정
          </button>
          <button className="btn btn-sm btn-outline-danger" onClick={onDelete}>
            삭제
          </button>
        </div>
      )}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex align-items-center gap-2">
          {user?.imageUrl && (
            <img
              src={user.imageUrl}
              alt={user.nickname}
              className="rounded-circle"
              width="32"
              height="32"
            />
          )}
          <span className="author-name fw-bold">{user?.nickname}</span>
          {courseName && <span className="author-batch">{courseName}</span>}
        </div>
        <div className="d-flex align-items-center gap-2 text-muted small">
          <span>
            {createdAt ? new Date(createdAt).toLocaleDateString() : ""}
          </span>
          <span className="mx-1">|</span>
          <span>조회 {post.viewCount ?? 0}</span>
        </div>
      </div>
      <hr />
      <div className="row g-3 bg-light">
        <div className="col-md-6">
          <p>
            <strong>팀원:</strong>
          </p>
          <ul>
            {projectMembers && projectMembers.length > 0 ? (
              projectMembers.map((member, i) => (
                <li key={i}>
                  {member.name} - {member.role}
                </li>
              ))
            ) : (
              <li>-</li>
            )}
          </ul>
        </div>
        <div className="col-md-6">
          <p>
            <strong>기간:</strong> {startedAt} ~ {endedAt}
          </p>
          <p>
            <strong>
              기술 스택:{" "}
              {tags?.map((tag, i) => (
                <span key={i} className="badge bg-dark gap-1">
                  {tag}
                </span>
              ))}
            </strong>
          </p>
          <div className="d-flex flex-wrap gap-2"></div>
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-dark"
              >
                <i className="bi bi-github"></i> GitHub
              </a>
            )}
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <i className="bi bi-globe"></i> Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
