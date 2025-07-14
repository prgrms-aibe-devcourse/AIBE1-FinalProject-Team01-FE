import React, { useState, useRef, useEffect } from "react";
import { Button, Form, Alert, Spinner } from "react-bootstrap";
import { COURSE_NAMES, BATCH_NUMBERS } from "../../constants/devcourse";

/**
 * 수강생 인증 폼 (인증용 사진 업로드)
 */
export const StudentVerificationForm = ({ onSave, onCancel, initial }) => {
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    verificationImage: "", // 🔄 인증용 이미지 (프로필 이미지 X)
    devcourseName: "",
    devcourseBatch: "",
  });

  const fileInputRef = useRef();

  useEffect(() => {
    if (initial) {
        setFormData({
            verificationImage: "",
            devcourseName: initial.devcourseName || "",
            devcourseBatch: initial.devcourseBatch || "",
        });
    }
  }, [initial]);

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("이미지 파일 크기는 5MB 이하여야 합니다.");
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, verificationImage: imageUrl }));
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.verificationImage) {
      setError("인증용 사진을 업로드해주세요.");
      return;
    }

    if (!formData.devcourseName.trim()) {
      setError("과정명을 입력해주세요.");
      return;
    }

    if (!formData.devcourseBatch.trim()) {
      setError("기수를 입력해주세요.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      // TODO: API 호출
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitted(true);
      setSuccess("수강생 인증 신청이 완료되었습니다!");
    } catch (err) {
      setError("신청에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // 제출 완료 후 승인 대기 화면
  if (submitted) {
    return (
      <div className="card p-4 text-center">
        <div className="mb-4">
          <i
            className="bi bi-clock-history text-primary"
            style={{ fontSize: "3rem" }}
          ></i>
        </div>

        <h5 className="mb-3">수강생 인증 신청 완료</h5>

        <Alert variant="info" className="mb-4">
          <div className="fw-medium mb-2">
            <i className="bi bi-info-circle me-2"></i>
            승인 대기 중
          </div>
          <div>
            관리자 검토 후 <strong>5-10분 내</strong>에 승인 결과를
            알려드립니다.
          </div>
        </Alert>

        <div className="text-muted mb-4">
          - 신청한 정보: {formData.devcourseName} {formData.devcourseBatch}기
          <br />• 승인 완료 시 알림이 발송됩니다
        </div>

        <Button variant="outline-primary" onClick={onCancel}>
          돌아가기
        </Button>
      </div>
    );
  }

  return (
    <Form className="card p-4" onSubmit={handleSubmit}>
      <h5 className="mb-4">수강생 인증</h5>

      {/* 안내 메시지 */}
      <Alert variant="light" className="mb-4">
        <div className="fw-medium mb-1">
          <i className="bi bi-shield-check me-2"></i>
          수강생 인증 안내
        </div>
        <small>
          신청 후 관리자 검토를 거쳐 <strong>5-10분 내</strong>에 승인 결과가
          나옵니다.
        </small>
      </Alert>

      {/* 에러/성공 메시지 */}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* 과정명 */}
      <div className="row mb-4">
        <div className="col-8">
            <Form.Group>
                <Form.Label className="fw-medium">과정명</Form.Label>
                <Form.Select
                    value={formData.devcourseName}
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, devcourseName: e.target.value }))
                    }
                    >
                    <option value="">과정을 선택해주세요</option>
                    {COURSE_NAMES.map((course) => (
                        <option key={course} value={course}>
                            {course}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>
        </div>

      {/* 기수 */}
        <div className="col-4">
            <Form.Group>
                <Form.Label className="fw-medium">기수</Form.Label>
                <Form.Select
                    value={formData.devcourseBatch}
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, devcourseBatch: e.target.value }))
                    }
                    >
                    <option value="">기수를 선택해주세요</option>
                    {BATCH_NUMBERS.map((batch) => (
                        <option key={batch} value={batch}>
                            {batch}기
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>
        </div>
      </div>

      {/* 인증용 사진 업로드 */}
      <Form.Group className="mb-4">
        <Form.Label className="fw-medium mb-3">인증용 사진 업로드</Form.Label>

        <div
          className="border-2 border-dashed rounded p-4"
          style={{ borderColor: "#dee2e6" }}
        >
          {formData.verificationImage ? (
            <div className="text-center">
              <img
                src={formData.verificationImage}
                alt="인증용 사진"
                className="rounded"
                style={{
                  maxWidth: "300px",
                  maxHeight: "200px",
                  objectFit: "contain",
                }}
              />
              <div className="mt-3">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => fileInputRef.current.click()}
                >
                  다른 사진 선택
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <i
                className="bi bi-cloud-upload text-muted"
                style={{ fontSize: "3rem" }}
              ></i>
              <div className="mt-3">
                <Button
                  variant="outline-primary"
                  onClick={() => fileInputRef.current.click()}
                >
                  <i className="bi bi-upload me-2"></i>
                  사진 선택
                </Button>
              </div>
              <div className="text-muted mt-2 small">
                JPG, PNG 파일 (최대 5MB)
              </div>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImgChange}
          />
        </div>

        {/* 업로드 예시 안내 */}
        <div className="mt-3 p-3 bg-light rounded">
          <div className="fw-medium mb-2">📷 인증용 사진 가이드</div>
          <div className="small text-muted">
            • 데브코스 수강을 증명할 수 있는 자료
            <br />
            • 과정명과 기수, 성함이 한장의 사진에 담길수있게 캡쳐해주세요
            <br />• 개인정보가 포함된 경우 일부 가릴 수 있습니다
          </div>
        </div>
      </Form.Group>

      {/* 버튼 */}
      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          취소
        </Button>
        <Button variant="primary" type="submit" disabled={saving}>
          {saving ? (
            <>
              <Spinner size="sm" className="me-2" />
              신청 중...
            </>
          ) : (
            <>
              <i className="bi bi-send me-2"></i>
              인증 신청
            </>
          )}
        </Button>
      </div>
    </Form>
  );
};
