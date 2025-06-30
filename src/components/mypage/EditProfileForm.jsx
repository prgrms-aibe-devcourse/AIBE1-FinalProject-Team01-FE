import React, { useState, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { INTEREST_TOPICS } from "../../constants/topics";

/**
 * 마이페이지 계정 관리(프로필 수정) 폼
 */
export const EditProfileForm = ({ initial, onSave, onCancel }) => {
  const [name, setName] = useState(initial.name);
  const [nickname, setNickname] = useState(initial.nickname);
  const [topics, setTopics] = useState(initial.topics);
  const [profileImg, setProfileImg] = useState(initial.profileImg);
  const [topicError, setTopicError] = useState("");
  const fileInputRef = useRef();

  const handleTopicClick = (topic) => {
    if (topics.includes(topic)) {
      setTopics(topics.filter((t) => t !== topic));
    } else if (topics.length < 3) {
      setTopics([...topics, topic]);
    } else {
      setTopicError("관심 주제는 최대 3개까지 선택할 수 있습니다.");
      return;
    }
    setTopicError("");
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !nickname) return;
    if (topics.length < 1) {
      setTopicError("관심 주제를 최소 1개 선택해 주세요.");
      return;
    }
    setTopicError("");
    onSave && onSave({ name, nickname, topics, profileImg });
  };

  return (
    <Form className="card p-4" onSubmit={handleSubmit}>
      <h5 className="mb-4">계정 관리</h5>
      <div className="d-flex align-items-center mb-3">
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#eee",
            overflow: "hidden",
            marginRight: 24,
            position: "relative",
          }}
        >
          {profileImg ? (
            <img
              src={profileImg}
              alt="프로필"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span
              className="d-flex align-items-center justify-content-center w-100 h-100 text-secondary"
              style={{ fontSize: 32 }}
            >
              <i className="bi bi-person-circle"></i>
            </span>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImgChange}
          />
          <Button
            variant="light"
            size="sm"
            style={{ position: "absolute", bottom: 4, right: 4 }}
            onClick={() => fileInputRef.current.click()}
          >
            변경
          </Button>
        </div>
        <div style={{ flex: 1 }}>
          <Form.Group className="mb-2">
            <Form.Label>이름</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>닉네임</Form.Label>
            <Form.Control
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>이메일</Form.Label>
            <Form.Control value={initial.email} readOnly plaintext />
          </Form.Group>
        </div>
      </div>
      <Form.Group className="mb-3">
        <Form.Label>관심 주제 (최소 1개, 최대 3개)</Form.Label>
        <div className="d-flex flex-wrap gap-2 mb-2">
          {INTEREST_TOPICS.map((topic) => (
            <Button
              key={topic}
              type="button"
              variant={topics.includes(topic) ? "primary" : "outline-secondary"}
              size="sm"
              className={topics.includes(topic) ? "fw-bold" : ""}
              onClick={() => handleTopicClick(topic)}
            >
              {topic}
            </Button>
          ))}
        </div>
        {topicError && (
          <div className="text-danger" style={{ fontSize: 13 }}>
            {topicError}
          </div>
        )}
        <div className="text-muted" style={{ fontSize: 13 }}>
          선택된 주제: {topics.join(", ") || "없음"}
        </div>
      </Form.Group>
      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          취소
        </Button>
        <Button variant="primary" type="submit">
          저장
        </Button>
      </div>
    </Form>
  );
};
