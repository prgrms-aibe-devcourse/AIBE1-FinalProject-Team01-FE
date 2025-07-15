import React, { useState, useRef, useEffect } from "react";
import { Button, Form, Alert, Spinner } from "react-bootstrap";
import { COURSE_NAMES, BATCH_NUMBERS, convertTrackToApi } from "../../constants/devcourse";
import { requestVerification, getVerificationStatus } from "../../services/verifyApi";
import example1 from '../../assets/example/1.jpg';
import example2 from '../../assets/example/2.jpg';
import "../../styles/components/mypage/verifyForm.css";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * 수강생 인증 폼 (인증용 사진 업로드)
 */
export const StudentVerificationForm = ({ onSave, onCancel, initial }) => {
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    verificationImage: "",
    devcourseName: "",
    devcourseBatch: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();
  const currentImageUrlRef = useRef(null);
  const [modalImg, setModalImg] = useState(null);

  useEffect(() => {
    if (initial) {
      setFormData({
        verificationImage: "",
        devcourseName: initial.devcourseName || "",
        devcourseBatch: initial.devcourseBatch || "",
      });
    }
  }, [initial]);

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const status = await getVerificationStatus();
        
        // 이미 인증이 완료되었거나 진행 중인 경우
        if (status.status === "COMPLETED" || status.status === "PROCESSING" || status.status === "PENDING") {
          setSubmitted(true);
          if (status.status === "COMPLETED") {
            setSuccess("인증이 완료되었습니다!");
          } else if (status.status === "PROCESSING") {
            setSuccess("인증이 처리 중입니다.");
          } else if (status.status === "PENDING") {
            setSuccess("인증이 검토 중입니다.");
          }
        }
      } catch (error) {
        console.error("인증 상태 확인 실패:", error);
      }
    };

    checkVerificationStatus();
  }, []);

  // 컴포넌트 언마운트 시 URL 해제
  useEffect(() => {
    return () => {
      if (currentImageUrlRef.current) {
        URL.revokeObjectURL(currentImageUrlRef.current);
      }
    };
  }, []);

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 타입 검증
      if (!file.type.startsWith('image/')) {
        setError("이미지 파일만 업로드 가능합니다.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("이미지 파일 크기는 5MB 이하여야 합니다.");
        return;
      }

      // 이전 URL이 있다면 해제
      if (currentImageUrlRef.current) {
        URL.revokeObjectURL(currentImageUrlRef.current);
      }

      // 새로운 URL 생성
      const imageUrl = URL.createObjectURL(file);
      currentImageUrlRef.current = imageUrl; // URL 추적
      
      setFormData((prev) => ({ ...prev, verificationImage: imageUrl }));
      setSelectedFile(file);
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

      // API 호출
      const result = await requestVerification({
        devcourseName: convertTrackToApi(formData.devcourseName),
        devcourseBatch: formData.devcourseBatch,
        image: selectedFile,
      });

      setSubmitted(true);
      if (result.status === "PROCESSING") {
        setSuccess("인증이 처리 중입니다.");
      } else {
        setSuccess("수강생 인증 신청이 완료되었습니다!");
      }
    } catch (err) {
      setError(err.message || "신청에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // 제출 완료 후 상태별 화면
  if (submitted) {
    const getStatusInfo = () => {
      if (success.includes("완료")) {
        return {
          icon: "bi-check-circle",
          color: "success",
          title: "수강생 인증 완료",
          message: "인증이 성공적으로 완료되었습니다!",
          description: "이제 수강생 권한으로 모든 기능을 이용하실 수 있습니다."
        };
      } else if (success.includes("처리 중")) {
        return {
          icon: "bi-arrow-clockwise",
          color: "primary",
          title: "인증 처리 중",
          message: "AI가 이미지를 분석하고 있습니다.",
          description: "잠시만 기다려주세요. 분석이 완료되면 결과를 알려드립니다."
        };
      } else {
        return {
          icon: "bi-clock-history",
          color: "info",
          title: "수강생 인증 신청 완료",
          message: "승인 대기 중",
          description: "관리자 검토 후 승인 결과를 알려드립니다."
        };
      }
    };

    const statusInfo = getStatusInfo();

    return (
      <div className="card p-4 text-center">
        <div className="mb-4">
          <i
            className={`bi ${statusInfo.icon} text-${statusInfo.color}`}
            style={{ fontSize: "3rem" }}
          ></i>
        </div>

        <h5 className="mb-3">{statusInfo.title}</h5>

        <Alert variant={statusInfo.color} className="mb-4">
          <div className="fw-medium mb-2">
            <i className="bi bi-info-circle me-2"></i>
            {statusInfo.message}
          </div>
          <div>
            {statusInfo.description}
          </div>
        </Alert>

        <div className="text-muted mb-4">
          - 신청한 정보: {formData.devcourseName} {formData.devcourseBatch}기
          <br />• 결과는 알림으로 발송됩니다
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
          신청 후 관리자 검토를 거쳐 승인 결과가 나옵니다.
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
          <div className="small text-muted mb-2">
            • 예시 사진을 참고하여 수강생 인증 이미지를 제출해주세요
            <br />
            • 왼쪽 창은 '프로그래머스 마이페이지 - 수강중인 코스' 창을, 오른쪽 창은 '데브코스 LMS' 창을 함께 캡쳐해주세요
            <br />
            • 수강생 인증 과정에 문제가 있을 경우 daycodingdan@gmail.com 으로 문의 부탁드립니다
          </div>
          <div className="d-flex gap-2 verification-example-thumbnails">
            {[example1, example2].map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`예시${idx + 1}`}
                className="verification-example-thumbnail"
                onClick={() => setModalImg(img)}
              />
            ))}
          </div>
          {/* 모달 */}
          {modalImg && (
            <div
              className="modal show verification-modal-backdrop"
              onClick={() => setModalImg(null)}
            >
              <div className="verification-modal-center">
                <img
                  src={modalImg}
                  alt="예시 크게 보기"
                  className="verification-modal-img"
                  onClick={e => e.stopPropagation()}
                />
              </div>
            </div>
          )}
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