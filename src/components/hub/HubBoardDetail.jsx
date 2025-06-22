import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostContent } from "../common/PostContent";
import { BoardDetailLayout } from "../board/BoardDetailLayout";
import "../../styles/components/hub/hub.css";

export const HubBoardDetail = ({ post }) => {
  const navigate = useNavigate();
  const { post_images, project } = post;
  const [mainImage, setMainImage] = useState(
    post_images?.[0]?.image_url || null
  );

  const handleEdit = () => {
    navigate(`/hub/write`, { state: { postToEdit: post } }); // 글쓰기 페이지 경로 추후 수정
  };

  const handleDelete = () => {
    if (window.confirm("정말로 이 프로젝트를 삭제하시겠습니까?")) {
      console.log("삭제할 프로젝트 ID:", post.id);
      alert("프로젝트가 삭제되었습니다.");
      navigate(`/hub`);
    }
  };

  return (
    <BoardDetailLayout post={post}>
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="fw-bold">{post.title}</h1>
        {/* TODO: Add edit/delete buttons based on auth */}
      </div>
      <div className="d-flex align-items-center text-muted small mb-3">
        <span>
          {project.devcourse_track} {project.devcourse_batch}기
        </span>
        <span className="mx-2">|</span>
        <span>{new Date(post.created_at).toLocaleDateString()}</span>
      </div>
      <div className="row g-5 mt-1">
        <div className="col-md-7">
          {post_images && post_images.length > 0 && (
            <div className="hub-detail-image-gallery">
              <img
                src={mainImage}
                alt={post.title}
                className="img-fluid rounded hub-detail-main-image mb-3"
              />
              {post_images.length > 1 && (
                <div className="d-flex flex-wrap gap-2">
                  {post_images.map((image, index) => (
                    <img
                      key={index}
                      src={image.image_url}
                      alt={`${post.title} thumbnail ${index + 1}`}
                      className={`rounded hub-detail-thumbnail ${
                        mainImage === image.image_url ? "active" : ""
                      }`}
                      onClick={() => setMainImage(image.image_url)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          <h4 className="mt-4">프로젝트 소개</h4>
          <hr />
          <PostContent post={post} stripImages={true} />
        </div>
        <div className="col-md-5">
          <div className="p-4 rounded bg-light">
            <h5 className="fw-bold">프로젝트 정보</h5>
            <hr />
            <p>
              <strong>기간:</strong> {project.started_at} ~ {project.ended_at}
            </p>
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
            <p>
              <strong>기술 스택:</strong>
            </p>
            <div className="d-flex flex-wrap gap-2">
              {post.tags.map((tag, i) => (
                <span key={i} className="badge bg-secondary">
                  {tag}
                </span>
              ))}
            </div>
            <div className="d-grid gap-2 mt-4">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-dark"
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
        </div>
      </div>
    </BoardDetailLayout>
  );
};
