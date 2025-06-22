import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/hub/hub.css";

/**
 * @typedef {Object} HubBoardListProps
 * @property {Array<Object>} posts
 */

export default function HubBoardList({ posts }) {
  const navigate = useNavigate();

  const handleCardClick = (postId) => {
    navigate(`/hub/${postId}`);
  };

  if (!posts || posts.length === 0) {
    return <p className="text-center my-5">프로젝트가 없습니다.</p>;
  }

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {posts.map((post) => {
        const { project, post_images, tags } = post;
        if (!project) return null;

        return (
          <div key={post.id} className="col">
            <div
              className="card h-100 hub-card"
              onClick={() => handleCardClick(post.id)}
            >
              <div className="hub-card-img-wrapper">
                {post_images && post_images.length > 0 ? (
                  <img
                    src={post_images[0].image_url}
                    alt={post.title}
                    className="hub-card-img"
                  />
                ) : (
                  <div className="d-flex justify-content-center align-items-center h-100 bg-light text-secondary">
                    <span>No Image</span>
                  </div>
                )}
                <span className="hub-card-likes">
                  <i className="bi bi-star-fill"></i> {post.like_count || 0}
                </span>
              </div>
              <div className="card-body d-flex flex-column">
                <p className="card-text text-primary small fw-bold">
                  {project.devcourse_track} {project.devcourse_batch}기
                </p>
                <h5 className="card-title fw-bold text-truncate mt-1">
                  {post.title}
                </h5>
                <p className="card-text text-muted mt-2 flex-grow-1">
                  {project.simple_content}
                </p>
                <p className="card-text small mt-2">
                  <strong>팀원:</strong>{" "}
                  {project.project_members.map((m) => m.name).join(", ")}
                </p>
                <p className="card-text small text-muted">
                  <strong>기간:</strong> {project.started_at} ~{" "}
                  {project.ended_at}
                </p>
                <div className="hub-card-tags mt-auto pt-3">
                  {tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="badge rounded-pill bg-light text-dark"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="card-footer hub-card-footer">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-dark btn-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <i className="bi bi-github"></i> GitHub
                  </a>
                )}
                {project.demo_url && (
                  <a
                    href={project.demo_url}
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
