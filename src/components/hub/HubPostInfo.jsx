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
    <div className="p-4 mb-4">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <p className="badge mb-2">
            {courseName} {batchNumber}기
          </p>
          <h1 className="fw-bold">{title}</h1>
        </div>
        {canEditOrDelete && (
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={onEdit}
            >
              수정
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={onDelete}
            >
              삭제
            </button>
          </div>
        )}
      </div>
      <div className="d-flex align-items-center text-muted small mt-2">
        {user?.imageUrl && (
          <img
            src={user.imageUrl}
            alt={user.nickname}
            className="rounded-circle me-2"
            width="24"
            height="24"
          />
        )}
        <span>{user?.nickname}</span>
        <span className="mx-2">|</span>
        <span>{createdAt ? new Date(createdAt).toLocaleDateString() : ""}</span>
      </div>
      <hr />
      <div className="row g-3">
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
            <strong>기술 스택:</strong>
          </p>
          <div className="d-flex flex-wrap gap-2">
            {tags?.map((tag, i) => (
              <span key={i} className="badge bg-dark">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3">
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
  );
};
