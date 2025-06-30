import React, { useState, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { isValidPassword, arePasswordsEqual } from "../../utils/auth";

export default function ChangePasswordPage({ onSave }) {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPwCheck, setNewPwCheck] = useState("");
  const [error, setError] = useState("");
  const newPwRef = useRef();
  const newPwCheckRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentPw || !newPw || !newPwCheck) {
      setError("모든 항목을 입력해 주세요.");
      return;
    }
    if (!isValidPassword(newPw)) {
      setError("새 비밀번호는 6자 이상, 알파벳과 숫자를 모두 포함해야 합니다.");
      newPwRef.current.focus();
      return;
    }
    if (!arePasswordsEqual(newPw, newPwCheck)) {
      setError("새 비밀번호가 일치하지 않습니다.");
      newPwCheckRef.current.focus();
      return;
    }
    setError("");
    onSave && onSave(newPw);
    alert("비밀번호가 변경되었습니다.");
    setCurrentPw("");
    setNewPw("");
    setNewPwCheck("");
  };

  return (
    <Form className="card p-4" onSubmit={handleSubmit}>
      <h5 className="mb-4">비밀번호 변경</h5>
      <Form.Group className="mb-3">
        <Form.Label>현재 비밀번호</Form.Label>
        <Form.Control
          type="password"
          value={currentPw}
          onChange={(e) => setCurrentPw(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>새 비밀번호</Form.Label>
        <Form.Control
          type="password"
          value={newPw}
          onChange={(e) => setNewPw(e.target.value)}
          ref={newPwRef}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>새 비밀번호 확인</Form.Label>
        <Form.Control
          type="password"
          value={newPwCheck}
          onChange={(e) => setNewPwCheck(e.target.value)}
          ref={newPwCheckRef}
          required
        />
      </Form.Group>
      {error && <div className="text-danger mb-2">{error}</div>}
      <div className="d-flex justify-content-end">
        <Button type="submit" variant="primary">
          저장
        </Button>
      </div>
    </Form>
  );
}
