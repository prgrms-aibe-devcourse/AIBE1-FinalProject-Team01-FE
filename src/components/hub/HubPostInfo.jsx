import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { isAuthor } from "../../utils/auth";
import { deletePost } from "../../services/hubApi";
import "../../styles/components/hub/hub.css";
import {formatDate} from "../../utils/date.js";
import {BOARD_TYPE_LABEL} from "../../pages/community/constants.js";
import {BoardPostHeader} from "../board/BoardPostHeader.jsx";

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
      <>
        <BoardPostHeader
            post={post}
            boardType={"PROJECT_HUB"}
            onEdit={canEditOrDelete ? handleEdit : undefined}
            onDelete={canEditOrDelete ? handleDelete : undefined}
            categoryLabel={"PROJECT_HUB"}
            isDeleting={isDeleting}
        />
    <div className="p-1 mt-3">
      {!post.isBlinded && (
          <div className="project-info-section">
            <div className="row">
              {/* 팀원 - 전체 너비 */}
              <div className="col-12">
                <div className="project-info-label">
                  팀원
                </div>
                <ul className="project-members-list">
                  {projectMembers && projectMembers.length > 0 ? (
                      projectMembers.map((member, i) => (
                          <li key={i} className="project-member-item">
                            {typeof member === 'string' ? member : `${member.name}${member.role ? ` - ${member.role}` : ''}`}
                          </li>
                      ))
                  ) : (
                      <li className="project-member-item">정보 없음</li>
                  )}
                </ul>
              </div>
              
              {/* 기간과 링크 - 좌우 분할 */}
              <div className="col-md-6">
                <div className="project-info-label">
                  기간
                </div>
                <div className="project-period">
                  {formatDate(startedAt)} ~ {formatDate(endedAt)}
                </div>
              </div>
              <div className="col-md-6">
                <div className="project-info-label">
                  링크
                </div>
                <div className="project-links">
                  {githubUrl && (
                      <a
                          href={githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link-btn github-btn"
                      >
                        <i className="bi bi-github"></i> GitHub
                      </a>
                  )}
                  {demoUrl && (
                      <a
                          href={demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link-btn demo-btn"
                      >
                        <i className="bi bi-globe"></i> Demo
                      </a>
                  )}
                </div>
              </div>
            </div>
          </div>
      )}
    </div>
      </>
  );
};
