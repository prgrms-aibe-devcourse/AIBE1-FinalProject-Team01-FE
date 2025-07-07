import React from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { TagInput } from "../common/TagInput";
import { DatePicker } from "../common/DatePicker";
import { CustomTiptapEditor } from "../editor/CustomTiptapEditor";

/**
 * @typedef {Object} ProjectMember
 * @property {string} name - 팀원 이름
 * @property {string} role - 팀원 역할
 */

/**
 * @typedef {Object} HubWriteFormProps
 * @property {string} courseName - 과정명
 * @property {string} batchNumber - 기수
 * @property {string} title - 제목
 * @property {string} simpleContent - 한 줄 소개
 * @property {Date|null} startedAt - 시작일
 * @property {Date|null} endedAt - 종료일
 * @property {ProjectMember[]} projectMembers - 팀원 목록
 * @property {string[]} tags - 태그 목록
 * @property {string} githubUrl - GitHub URL
 * @property {string} demoUrl - Demo URL
 * @property {string} content - 프로젝트 내용
 * @property {string[]} courseNames - 과정명 옵션
 * @property {number[]} batchNumbers - 기수 옵션
 * @property {boolean} validated - 유효성 검사 상태
 * @property {boolean} isEditMode - 수정 모드 여부
 * @property {Object} handlers - 이벤트 핸들러들
 */

/**
 * 허브 프로젝트 작성 폼 컴포넌트
 * @param {HubWriteFormProps} props
 */
export const HubWriteForm = ({
  // 폼 데이터
  courseName,
  batchNumber,
  title,
  simpleContent,
  startedAt,
  endedAt,
  projectMembers,
  tags,
  githubUrl,
  demoUrl,
  content,
  // 옵션 데이터
  courseNames,
  batchNumbers,
  // 상태
  validated,
  isEditMode,
  // 핸들러들
  handlers
}) => {
  const {
    onCourseNameChange,
    onBatchNumberChange,
    onTitleChange,
    onSimpleContentChange,
    onStartDateChange,
    onEndDateChange,
    onMembersChange,
    onTagsChange,
    onGithubUrlChange,
    onDemoUrlChange,
    onContentChange,
    onImageUpload
  } = handlers;

  // 팀원 관련 핸들러들
  const handleAddMember = () => {
    onMembersChange([...projectMembers, { name: "", role: "" }]);
  };

  const handleRemoveMember = (index) => {
    if (projectMembers.length > 1) {
      onMembersChange(projectMembers.filter((_, i) => i !== index));
    }
  };

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = projectMembers.map((member, i) =>
      i === index ? { ...member, [field]: value } : member
    );
    onMembersChange(updatedMembers);
  };

  return (
    <>
      {/* 기본 정보 */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>과정명 *</Form.Label>
            {isEditMode ? (
              // 수정 모드에서는 드롭다운으로 변경 가능
              <Form.Select
                value={courseName}
                onChange={(e) => onCourseNameChange(e.target.value)}
                required
                isInvalid={validated && !courseName}
              >
                <option value="">과정을 선택하세요</option>
                {courseNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Form.Select>
            ) : (
              // 신규 작성 시에는 로그인한 사용자의 정보로 고정
              <Form.Control
                type="text"
                value={courseName || "정보 없음"}
                readOnly
                className="bg-light"
                title="로그인한 사용자의 과정 정보입니다"
              />
            )}
            <Form.Control.Feedback type="invalid">
              과정을 선택해주세요.
            </Form.Control.Feedback>
            {!isEditMode && (
              <Form.Text className="text-muted">
                현재 로그인한 계정의 과정 정보입니다.
              </Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>기수 *</Form.Label>
            {isEditMode ? (
              // 수정 모드에서는 드롭다운으로 변경 가능
              <Form.Select
                value={batchNumber}
                onChange={(e) => onBatchNumberChange(e.target.value)}
                required
                isInvalid={validated && !batchNumber}
              >
                <option value="">기수를 선택하세요</option>
                {batchNumbers.map((num) => (
                  <option key={num} value={num}>
                    {num}기
                  </option>
                ))}
              </Form.Select>
            ) : (
              // 신규 작성 시에는 로그인한 사용자의 정보로 고정
              <Form.Control
                type="text"
                value={batchNumber ? `${batchNumber}기` : "정보 없음"}
                readOnly
                className="bg-light"
                title="로그인한 사용자의 기수 정보입니다"
              />
            )}
            <Form.Control.Feedback type="invalid">
              기수를 선택해주세요.
            </Form.Control.Feedback>
            {!isEditMode && (
              <Form.Text className="text-muted">
                현재 로그인한 계정의 기수 정보입니다.
              </Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>프로젝트 제목 *</Form.Label>
        <Form.Control
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="프로젝트 제목을 입력하세요"
          required
          isInvalid={validated && !title.trim()}
        />
        <Form.Control.Feedback type="invalid">
          프로젝트 제목을 입력해주세요.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>한 줄 소개 *</Form.Label>
        <Form.Control
          type="text"
          value={simpleContent}
          onChange={(e) => onSimpleContentChange(e.target.value)}
          placeholder="프로젝트를 한 줄로 소개해주세요 (최대 100자)"
          maxLength={100}
          required
          isInvalid={validated && !simpleContent.trim()}
        />
        <Form.Control.Feedback type="invalid">
          프로젝트 한 줄 소개를 입력해주세요.
        </Form.Control.Feedback>
        <Form.Text className="text-muted">
          {simpleContent.length}/100자
        </Form.Text>
      </Form.Group>

      {/* 프로젝트 일정 */}
      <Form.Group className="mb-4">
        <Form.Label>프로젝트 일정 *</Form.Label>
        <DatePicker
          startDate={startedAt}
          endDate={endedAt}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
          validated={validated}
          startLabel="시작일"
          endLabel="종료일"
          startPlaceholder="시작일을 선택하세요"
          endPlaceholder="종료일을 선택하세요"
        />
      </Form.Group>

      {/* 팀원 정보 */}
      <Form.Group className="mb-4">
        <Form.Label>팀원 *</Form.Label>
        <div className="team-members-container">
          {projectMembers.map((member, index) => (
            <Row key={index} className="team-member-row g-2 mb-3">
              <Col xs={12} md={5}>
                <Form.Control
                  type="text"
                  value={member.name}
                  onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                  placeholder="이름"
                  required={index === 0}
                  isInvalid={validated && index === 0 && !member.name.trim()}
                />
                {validated && index === 0 && !member.name.trim() && (
                  <Form.Control.Feedback type="invalid">
                    최소 1명의 팀원을 입력해주세요.
                  </Form.Control.Feedback>
                )}
              </Col>
              <Col xs={12} md={5}>
                <Form.Control
                  type="text"
                  value={member.role}
                  onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                  placeholder="역할 (선택)"
                  className="optional-field"
                />
              </Col>
              <Col xs={12} md={2} className="d-flex align-items-start">
                {projectMembers.length > 1 ? (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemoveMember(index)}
                    className="team-member-delete-btn w-100"
                  >
                    삭제
                  </Button>
                ) : (
                  <div style={{ height: '38px' }}></div>
                )}
              </Col>
            </Row>
          ))}
        </div>
        <div className="team-add-btn-container">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleAddMember}
          >
            <i className="bi bi-plus-circle me-1"></i>
            팀원 추가
          </Button>
        </div>
      </Form.Group>

      {/* 기술 스택 (태그) */}
      <Form.Group className="mb-3">
        <Form.Label>기술 스택 (최대 10개)</Form.Label>
        <TagInput 
          tags={tags} 
          onTagsChange={onTagsChange}
          placeholder="기술 스택을 입력하세요 (예: React, Node.js, MySQL)"
        />
      </Form.Group>

      {/* GitHub & Demo URL */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>GitHub 주소 *</Form.Label>
            <Form.Control
              type="url"
              value={githubUrl}
              onChange={(e) => onGithubUrlChange(e.target.value)}
              placeholder="https://github.com/username/repo"
              className="optional-field"
              required
              isInvalid={validated && !githubUrl.trim()}
            />
            <Form.Control.Feedback type="invalid">
              프로젝트 깃허브 주소를 입력해주세요.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>라이브 데모 (배포)</Form.Label>
            <Form.Control
              type="url"
              value={demoUrl}
              onChange={(e) => onDemoUrlChange(e.target.value)}
              placeholder="https://your-demo.com"
              className="optional-field"
            />
          </Form.Group>
        </Col>
      </Row>

      {/* 프로젝트 내용 */}
      <Form.Group className="mb-3">
        <Form.Label>프로젝트 내용 *</Form.Label>
        <div className={`${validated && !content.trim() ? 'is-invalid' : ''}`}>
          <CustomTiptapEditor
            content={content}
            onChange={onContentChange}
            onImageUpload={onImageUpload}
            placeholder="프로젝트에 대해 자세히 설명해주세요..."
          />
        </div>
        {validated && !content.trim() && (
          <div className="invalid-feedback d-block">
            프로젝트 내용을 입력해주세요.
          </div>
        )}
      </Form.Group>
    </>
  );
};
