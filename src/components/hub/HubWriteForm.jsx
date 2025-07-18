import React from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import {TagInput} from "../common/TagInput";
import {DatePicker} from "../common/DatePicker";
import {CustomTiptapEditor} from "../editor/CustomTiptapEditor";

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
  validated,
  handlers
}) => {
  const {
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
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>과정명 *</Form.Label>
            <Form.Control
              type="text"
              value={courseName || "정보 없음"}
              readOnly
              className="bg-light"
              title="사용자의 데브코스 과정 정보입니다"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>기수 *</Form.Label>
            <Form.Control
              type="text"
              value={batchNumber ? `${batchNumber}기` : "정보 없음"}
              readOnly
              className="bg-light"
              title="사용자의 데브코스 과정 기수 정보입니다"
            />
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
        <Form.Label>태그 (최대 10개)</Form.Label>
        <TagInput
          tags={tags}
          onTagsChange={onTagsChange}
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
