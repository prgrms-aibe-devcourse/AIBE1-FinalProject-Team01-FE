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
  const canEditOrDelete = isAuthor(currentUser, post.user_id);
  const { project, user } = post;

  return (
    <div className="p-4 mb-4">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <p className="badge mb-2">
            {project.devcourse_track} {project.devcourse_batch}기
          </p>
          <h1 className="fw-bold">{post.title}</h1>
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
        <img
          src={user.image_url}
          alt={user.nickname}
          className="rounded-circle me-2"
          width="24"
          height="24"
        />
        <span>{user.nickname}</span>
        <span className="mx-2">|</span>
        <span>{new Date(post.created_at).toLocaleDateString()}</span>
      </div>
      <hr />
      <div className="row g-3">
        <div className="col-md-6">
          <p>
            <strong>팀원:</strong>
          </p>
          <ul>
            {project.project_members.map((member, i) => (
              <li key={i}>
                {member.name} - {member.role}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-6">
          <p>
            <strong>기간:</strong> {project.started_at} ~ {project.ended_at}
          </p>
          <p>
            <strong>기술 스택:</strong>
          </p>
          <div className="d-flex flex-wrap gap-2">
            {post.tags.map((tag, i) => (
              <span key={i} className="badge bg-dark">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3">
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-dark"
          >
            <i className="bi bi-github"></i> GitHub
          </a>
        )}
        {project.demo_url && (
          <a
            href={project.demo_url}
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
