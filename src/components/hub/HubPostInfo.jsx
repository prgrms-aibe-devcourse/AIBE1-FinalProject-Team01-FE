import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { isAuthor } from "../../utils/auth";
import { deletePost } from "../../services/hubApi";
import "../../styles/components/hub/hub.css";
import {formatDate} from "../../utils/date.js";

/**
 * @typedef {Object} HubPostInfoProps
 * @property {object} post
 */
export const HubPostInfo = ({ post }) => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const canEditOrDelete = currentUser && isAuthor(currentUser, post.authorId);

  // 수정 버튼 핸들러
  const handleEdit = () => {
    navigate(`/hub/${post.projectId}/edit`, {
      state: { project: post } 
    });
  };

  // 삭제 버튼 핸들러
  const handleDelete = async () => {
    if (isDeleting) return; // 이미 삭제 중이면 무시
    
    if (window.confirm("정말로 이 프로젝트를 삭제하시겠습니까?")) {
      setIsDeleting(true);
      
      try {
        await deletePost(post.projectId);
        alert("프로젝트가 삭제되었습니다.");
        navigate('/hub');
      } catch (error) {
        console.error("프로젝트 삭제 실패:", error);
        
        // 상세한 에러 메시지 처리
        let errorMessage = "프로젝트 삭제에 실패했습니다.";
        
        if (error.response) {
          const status = error.response.status;
          const data = error.response.data;
          
          switch (status) {
            case 400:
              errorMessage = "잘못된 프로젝트 ID입니다.";
              break;
            case 401:
              errorMessage = "로그인이 만료되었습니다. 다시 로그인해주세요.";
              setTimeout(() => navigate("/login"), 2000);
              break;
            case 403:
              errorMessage = "프로젝트 삭제 권한이 없습니다.";
              break;
            case 404:
              errorMessage = "존재하지 않는 프로젝트입니다.";
              break;
            case 409:
              errorMessage = "삭제할 수 없는 프로젝트입니다.";
              break;
            case 500:
              errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
              break;
            default:
              errorMessage = data?.message || error.message || "알 수 없는 오류가 발생했습니다.";
          }
        } else if (error.request) {
          errorMessage = "네트워크 연결을 확인해주세요.";
        } else {
          errorMessage = error.message || "프로젝트 삭제 중 오류가 발생했습니다.";
        }
        
        alert(errorMessage);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const {
    courseName,
    title,
    user,
    createdAt,
    projectMembers,
    startedAt,
    endedAt,
    githubUrl,
    demoUrl,
  } = post;

  return (
    <div className="p-1 mt-3">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <h1 className="fw-bold mb-0">{title}</h1>
        {canEditOrDelete && (
          <div className="hub-post-actions">
            <button 
              className="btn btn-sm btn-link text-muted p-1"
              onClick={handleEdit}
              title="수정"
            >
              <i className="bi bi-pencil-square fs-5"></i>
            </button>
            <button 
              className="btn btn-sm btn-link text-muted p-1"
              onClick={handleDelete}
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
          {/* 과정 명만 노출, 기수는 민감하기에 노출안함 */}
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
                  {typeof member === 'string' ? member : `${member.name}${member.role ? ` - ${member.role}` : ''}`}
                </li>
              ))
            ) : (
              <li>-</li>
            )}
          </ul>
        </div>
        <div className="col-md-6">
          <p>
            <strong>기간:</strong> {formatDate(startedAt)} ~ {formatDate(endedAt)}
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
