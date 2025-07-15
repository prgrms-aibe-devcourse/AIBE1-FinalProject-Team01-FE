import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Form, Alert } from "react-bootstrap";
import { useImageUpload } from "../../hooks/useImageUpload";
import { useAuth } from "../../context/AuthContext";
import {
  convertTrackToApi
} from "../../constants/devcourse";
import { createPost, updatePost } from "../../services/hubApi";
import { HubWriteForm } from "../../components/hub/HubWriteForm";
import { ValidationAlert } from "../../components/common/ValidationAlert";
import "../../styles/components/hub/hub.css";

const HubWritePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { project } = location.state || {};
  const { isLoggedIn, user } = useAuth();

  // 로그인 체크
  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login", { 
        state: { from: location.pathname },
        replace: true,
      });
      return;
    }
  }, [isLoggedIn, navigate, location.pathname]);

  // 기본 필드들
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [content, setContent] = useState("");
  const [simpleContent, setSimpleContent] = useState("");

  // Hub 전용 필드들 - 로그인한 사용자 정보로 초기화
  const [courseName, setCourseName] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [startedAt, setStartedAt] = useState(null);
  const [endedAt, setEndedAt] = useState(null);
  const [projectMembers, setProjectMembers] = useState([
    { name: "", role: "" },
  ]);
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");

  // UI 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const isEditMode = !!project;

  const { imageUrls, handleUpload, setImageUrls } = useImageUpload(
    project?.images || []
  );

  // 로그인한 사용자 정보로 트랙, 기수 설정
  useEffect(() => {
    if (isLoggedIn && user && !isEditMode) {
      // 사용자 정보에서 트랙과 기수를 추출
      if (user.devcourseTrack) {
        setCourseName(user.devcourseTrack);
      }
      if (user.devcourseBatch) {
        setBatchNumber(user.devcourseBatch.toString());
      }
      
      // 첫 번째 팀원으로 본인 추가
      if (user.nickname) {
        setProjectMembers([{ name: user.nickname, role: "" }]);
      }
    }
  }, [isLoggedIn, user, isEditMode]);

  useEffect(() => {
    if (isEditMode && project) {
      setTitle(project.title);
      setTags(project.tags || []);
      setContent(project.content);
      setSimpleContent(project.simpleContent || "");
      setStartedAt(project.startedAt ? new Date(project.startedAt) : null);
      setEndedAt(project.endedAt ? new Date(project.endedAt) : null);
      setProjectMembers(project.projectMembers || [{ name: "", role: "" }]);
      setGithubUrl(project.githubUrl || "");
      setDemoUrl(project.demoUrl || "");
      setImageUrls(project.images || []);

      if (user?.devcourseTrack) {
        setCourseName(user.devcourseTrack);
      }
      if (user?.devcourseBatch) {
        setBatchNumber(user.devcourseBatch.toString());
      }
    }
  }, [isEditMode, project, user, setImageUrls]);

  // 유효성 검사 에러 메시지 생성
  const getValidationErrors = () => {
    const errors = [];
    if (!courseName) errors.push("과정명 정보가 없습니다. 프로필을 확인해주세요");
    if (!batchNumber) errors.push("기수 정보가 없습니다. 프로필을 확인해주세요");
    if (!title.trim()) errors.push("프로젝트 제목을 입력해주세요");
    if (!simpleContent.trim()) errors.push("한 줄 소개를 입력해주세요");
    if (!startedAt) errors.push("프로젝트 시작일을 선택해주세요");
    if (!endedAt) errors.push("프로젝트 종료일을 선택해주세요");
    if (!projectMembers.some((member) => member.name.trim()))
      errors.push("최소 1명의 팀원을 입력해주세요");
    if (!content.trim()) errors.push("프로젝트 내용을 입력해주세요");
    if (!githubUrl.trim()) errors.push("깃허브 주소를 입력해주세요");
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    // 커스텀 유효성 검사
    const isValid =
      form.checkValidity() &&
      courseName &&
      batchNumber &&
      title.trim() &&
      simpleContent.trim() &&
      projectMembers.some((member) => member.name.trim()) &&
      content.trim() &&
      startedAt &&
      endedAt;

    setValidated(true);

    if (!isValid) {
      // 필수 필드가 비어있을 때 스크롤을 맨 위로 이동
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const postData = {
        title,
        content,
        simpleContent,
        devcourseTrack: convertTrackToApi(courseName),
        devcourseBatch: parseInt(batchNumber),
        startedAt: startedAt ? startedAt.toISOString() : null,
        endedAt: endedAt ? endedAt.toISOString() : null,
        projectMembers: projectMembers.filter((member) => member.name.trim()),
        tags: tags,
        githubUrl: githubUrl || null,
        demoUrl: demoUrl || null,
        images: imageUrls,
      };

      if (isEditMode) {
        console.log("수정된 프로젝트 데이터:", {
          ...postData,
          projectId: project.projectId,
        });
        await updatePost(project.projectId, postData);
        alert("프로젝트가 수정되었습니다.");
        navigate(`/hub/${project.projectId}`);
      } else {
        console.log("작성된 프로젝트 데이터:", postData);
        await createPost(postData);
        alert("프로젝트가 작성되었습니다.");
        navigate("/hub");
      }
    } catch (error) {
      console.error("프로젝트 등록 실패:", error);
      
      // 상세한 에러 메시지 처리
      let errorMessage = "프로젝트 등록에 실패했습니다.";
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 400:
            errorMessage = data.message || "입력 정보를 확인해주세요.";
            break;
          case 401:
            errorMessage = "로그인이 만료되었습니다. 다시 로그인해주세요.";
            setTimeout(() => navigate("/login"), 2000);
            break;
          case 403:
            errorMessage = "프로젝트 등록 권한이 없습니다.";
            break;
          case 409:
            errorMessage = "이미 존재하는 프로젝트입니다.";
            break;
          case 413:
            errorMessage = "업로드한 파일 크기가 너무 큽니다.";
            break;
          case 500:
            errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
            break;
          default:
            errorMessage = data.message || "알 수 없는 오류가 발생했습니다.";
        }
      } else if (error.request) {
        errorMessage = "네트워크 연결을 확인해주세요.";
      }
      
      setSubmitError(errorMessage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 핸들러들을 객체로 정리
  const handlers = {
    onTitleChange: setTitle,
    onSimpleContentChange: setSimpleContent,
    onStartDateChange: setStartedAt,
    onEndDateChange: setEndedAt,
    onMembersChange: setProjectMembers,
    onTagsChange: setTags,
    onGithubUrlChange: setGithubUrl,
    onDemoUrlChange: setDemoUrl,
    onContentChange: setContent,
    onImageUpload: handleUpload,
  };

  // 로그인하지 않은 경우 로딩 표시
  if (!isLoggedIn) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">로그인 상태를 확인하는 중...</p>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: 900 }}>
      <h2 className="mb-4">
        {isEditMode ? "프로젝트 수정하기" : "프로젝트 등록하기"}
      </h2>

      {/* 에러 메시지 */}
      {submitError && (
        <Alert variant="danger" dismissible onClose={() => setSubmitError(null)}>
          <Alert.Heading>등록 실패</Alert.Heading>
          <p>{submitError}</p>
        </Alert>
      )}

      {/* 필수 항목 안내 */}
      <ValidationAlert show={validated} errors={getValidationErrors()} />

      <Form onSubmit={handleSubmit} noValidate validated={validated}>
        <HubWriteForm
          // 폼 데이터
          courseName={courseName}
          batchNumber={batchNumber}
          title={title}
          simpleContent={simpleContent}
          startedAt={startedAt}
          endedAt={endedAt}
          projectMembers={projectMembers}
          tags={tags}
          githubUrl={githubUrl}
          demoUrl={demoUrl}
          content={content}
          // 상태
          validated={validated}
          isEditMode={isEditMode}
          // 핸들러들
          handlers={handlers}
        />

        {/* 버튼 */}
        <div className="d-flex gap-2 justify-content-end mt-4">
          <Button variant="secondary" onClick={() => navigate(-1)} disabled={isSubmitting}>
            취소
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? isEditMode
                ? "수정 중..."
                : "등록 중..."
              : isEditMode
              ? "수정 완료"
              : "등록 완료"}
          </Button>
        </div>
      </Form>
    </div>
  );
};
export default HubWritePage;
