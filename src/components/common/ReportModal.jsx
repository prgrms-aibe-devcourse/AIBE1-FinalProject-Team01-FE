import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import {
    ExclamationTriangle,
    ChatDots,
    PersonX,
    Flag,
    ShieldCheck,
    EyeSlash,
} from "react-bootstrap-icons";

/**
 * ReportType enum 값들
 */
const REPORT_TYPES = {
    BAD_WORDS: { label: "욕설/비방", icon: ExclamationTriangle, description: "욕설, 비방, 혐오 표현" },
    SPAM: { label: "스팸/광고", icon: Flag, description: "광고 및 스팸성 게시물" },
    SEXUAL_CONTENT: { label: "음란물/선정성", icon: EyeSlash, description: "음란물, 선정적 내용" },
    PERSONAL_INFO: { label: "개인정보 노출", icon: PersonX, description: "개인정보 노출, 사생활 침해" },
    FLOODING: { label: "도배성", icon: ShieldCheck, description: "반복적인 도배, 무의미한 글" },
    OTHER: { label: "기타", icon: ChatDots, description: "기타 신고 사유" },
};

/**
 * 신고 모달 컴포넌트
 * @param {Object} props
 * @param {boolean} props.show - 모달 표시 여부
 * @param {function} props.onHide - 모달 닫기 핸들러
 * @param {number} props.targetId - 신고 대상 ID
 * @param {'POST'|'COMMENT'} props.reportTarget - 신고 대상 타입
 * @param {function} props.onSubmit - 신고 제출 핸들러
 */
const ReportModal = ({ show, onHide, targetId, reportTarget, onSubmit }) => {
    const [selectedType, setSelectedType] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedType) {
            setError("신고 사유를 선택해주세요.");
            return;
        }

        if (!description.trim()) {
            setError("신고 내용을 입력해주세요.");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const reportData = {
                targetId,
                reportTarget,
                reportType: selectedType,
                description: description.trim(),
            };

            await onSubmit(reportData);

            // 성공 시 모달 초기화 및 닫기
            setSelectedType("");
            setDescription("");
            onHide();
        } catch (err) {
            setError(err.message || "신고 처리 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setSelectedType("");
            setDescription("");
            setError("");
            onHide();
        }
    };

    const targetText = reportTarget === "POST" ? "게시글" : "댓글";

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    <ExclamationTriangle className="text-warning me-2" />
                    {targetText} 신고하기
                </Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && (
                        <Alert variant="danger" className="mb-3">
                            {error}
                        </Alert>
                    )}

                    <div className="mb-4">
                        <p className="text-muted mb-3">
                            부적절한 {targetText}을 신고해 주세요. 신고는 관리자가 검토한 후 처리됩니다.
                        </p>
                    </div>

                    {/* 신고 사유 선택 */}
                    <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                            신고 사유 <span className="text-danger">*</span>
                        </Form.Label>
                        <Row className="g-3 mt-1">
                            {Object.entries(REPORT_TYPES).map(([value, config]) => {
                                const IconComponent = config.icon;
                                return (
                                    <Col md={6} key={value}>
                                        <div
                                            className={`border rounded p-3 h-100 cursor-pointer position-relative ${
                                                selectedType === value
                                                    ? "border-primary bg-light"
                                                    : "border-secondary"
                                            }`}
                                            style={{
                                                cursor: "pointer",
                                                transition: "all 0.2s ease"
                                            }}
                                            onClick={() => setSelectedType(value)}
                                        >

                                            <div className="d-flex align-items-start">
                                                <IconComponent
                                                    size={20}
                                                    className={`me-3 mt-1 ${
                                                        selectedType === value ? "text-primary" : "text-secondary"
                                                    }`}
                                                />
                                                <div>
                                                    <div className="fw-semibold mb-1">{config.label}</div>
                                                    <small className="text-muted">{config.description}</small>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Form.Group>

                    {/* 신고 내용 */}
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                            신고 내용 <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="신고하는 이유를 구체적으로 설명해 주세요. (최소 10자 이상)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            isInvalid={error && !description.trim()}
                            maxLength={500}
                        />
                        <div className="d-flex justify-content-between mt-1">
                            <Form.Text className="text-muted">
                                구체적인 신고 사유를 작성하면 더 빠른 처리가 가능합니다.
                            </Form.Text>
                            <small className="text-muted">
                                {description.length}/500
                            </small>
                        </div>
                    </Form.Group>

                    <div className="bg-light p-3 rounded">
                        <small className="text-muted">
                            <strong>주의사항:</strong> 허위 신고 시 서비스 이용에 제재를 받을 수 있습니다.
                            신고는 신중하게 해주세요.
                        </small>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="outline-secondary"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        취소
                    </Button>
                    <Button
                        variant="danger"
                        type="submit"
                        disabled={isSubmitting || !selectedType || !description.trim()}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                신고 처리중...
                            </>
                        ) : (
                            "신고하기"
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ReportModal;