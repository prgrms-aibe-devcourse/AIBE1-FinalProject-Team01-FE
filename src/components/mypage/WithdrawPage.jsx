import React, { useState } from "react";
import { Button, Form, Alert, Spinner, Modal, InputGroup } from "react-bootstrap";
import { accountApi } from "../../services/accountApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function WithdrawPage({ profile }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [selectedReason, setSelectedReason] = useState('');
    const [otherReason, setOtherReason] = useState('');

    const { logout } = useAuth();
    const navigate = useNavigate();

    // 탈퇴 사유 옵션
    const withdrawReasons = [
        { value: 'not_useful', label: '서비스가 유용하지 않음' },
        { value: 'privacy_concern', label: '개인정보 보호 우려' },
        { value: 'rarely_use', label: '잘 사용하지 않음' },
        { value: 'found_alternative', label: '다른 서비스 이용' },
        { value: 'technical_issues', label: '기술적 문제' },
        { value: 'other', label: '기타' }
    ];

    const handleWithdrawClick = () => {
        if (!selectedReason) {
            setError('탈퇴 사유를 선택해주세요.');
            return;
        }
        if (selectedReason === 'other' && !otherReason.trim()) {
            setError('기타 사유를 입력해주세요.');
            return;
        }
        if (!agreedToTerms) {
            setError('탈퇴 시 주의사항에 동의해주세요.');
            return;
        }

        setError('');
        setShowConfirmModal(true);
    };

    const handleConfirmWithdraw = () => {
        setShowConfirmModal(false);

        // 로컬 계정이 아닌 경우 (소셜 로그인) 바로 탈퇴 처리
        if (profile?.providerType !== "LOCAL") {
            handleFinalWithdraw();
        } else {
            // 로컬 계정인 경우 비밀번호 확인 모달 표시
            setShowPasswordModal(true);
        }
    };

    const handleFinalWithdraw = async () => {
        // 로컬 계정인 경우 비밀번호 검증
        if (profile?.providerType === "LOCAL" && !password.trim()) {
            setPasswordError('비밀번호를 입력해주세요.');
            return;
        }

        try {
            setLoading(true);
            setPasswordError('');

            // 로컬 계정인 경우에만 비밀번호 전송
            const requestData = profile?.providerType === "LOCAL"
                ? { currentPassword: password }
                : {};

            await accountApi.deleteAccount(requestData);

            // 성공 시 로그아웃 및 메인 페이지로 이동
            navigate("/");
            logout();
            alert("회원 탈퇴가 완료되었습니다. 그동안 이용해 주셔서 감사합니다.");

        } catch (err) {
            console.error('회원 탈퇴 실패:', err);

            if (err.response?.status === 400 || err.response?.status === 401) {
                setPasswordError('비밀번호가 올바르지 않습니다.');
            } else if (err.response?.data?.message) {
                setPasswordError(err.response.data.message);
            } else {
                setPasswordError('회원 탈퇴에 실패했습니다. 다시 시도해주세요.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModals = () => {
        setShowConfirmModal(false);
        setShowPasswordModal(false);
        setPassword('');
        setPasswordError('');
    };

    return (
        <>
            <div className="card p-4">
                <h5 className="mb-3 text-danger">회원 탈퇴</h5>

                {error && (
                    <Alert variant="warning" className="mb-3">
                        <i className="bi bi-exclamation-circle me-2"></i>
                        {error}
                    </Alert>
                )}

                {/* 주의사항 */}
                <div
                    className="mb-4"
                    style={{
                        background: "#fff0f0",
                        border: "1px solid #ffcccc",
                        padding: 16,
                        borderRadius: 8,
                    }}
                >
                    <h6 className="text-danger mb-3">탈퇴 시 삭제되는 정보</h6>
                    <ul className="mb-0 text-danger" style={{ fontSize: 15 }}>
                        <li>개인정보 (이름, 이메일, 프로필 등)</li>
                        <li>작성한 모든 게시글 및 댓글</li>
                        <li>좋아요 및 북마크 기록</li>
                        <li>활동 기록 및 통계</li>
                        <li>관심 토픽 설정</li>
                    </ul>
                </div>

                {/* 탈퇴 사유 선택 */}
                <Form.Group className="mb-4">
                    <Form.Label className="fw-medium mb-3">탈퇴 사유를 선택해주세요 *</Form.Label>

                    {withdrawReasons.map((reason) => (
                        <Form.Check
                            key={reason.value}
                            type="radio"
                            id={`reason-${reason.value}`}
                            name="withdrawReason"
                            value={reason.value}
                            label={reason.label}
                            checked={selectedReason === reason.value}
                            onChange={(e) => setSelectedReason(e.target.value)}
                            className="mb-2"
                        />
                    ))}

                    {selectedReason === 'other' && (
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="탈퇴 사유를 자세히 입력해주세요"
                            value={otherReason}
                            onChange={(e) => setOtherReason(e.target.value)}
                            className="mt-3"
                            maxLength={500}
                        />
                    )}
                </Form.Group>

                {/* 주의사항 동의 */}
                <div className="mb-4">
                    <Form.Check
                        type="checkbox"
                        id="agree-terms"
                        label="위 내용을 모두 확인했으며, 회원 탈퇴에 동의합니다."
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="text-danger"
                    />
                </div>

                {/* 대안 제안 */}
                <Alert variant="info" className="mb-4">
                    <h6 className="mb-2">
                        <i className="bi bi-lightbulb me-2"></i>
                        탈퇴하시기 전에 고려해보세요
                    </h6>
                    <ul className="mb-0 small">
                        <li>계정 설정에서 알림을 끄거나 개인정보를 수정할 수 있습니다</li>
                        <li>일시적으로 서비스 이용을 중단하시려면 로그아웃만 하셔도 됩니다</li>
                        <li>문제가 있으시면 고객센터로 문의해주세요</li>
                    </ul>
                </Alert>

                <div className="d-flex justify-content-end">
                    <Button variant="danger" onClick={handleWithdrawClick}>
                        회원 탈퇴
                    </Button>
                </div>
            </div>

            {/* 첫 번째 확인 모달 */}
            <Modal show={showConfirmModal} onHide={handleCloseModals} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-danger">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        회원 탈퇴 확인
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center mb-4">
                        <i className="bi bi-person-x text-danger" style={{ fontSize: '3rem' }}></i>
                    </div>

                    <div className="text-center mb-4">
                        <h6>정말로 회원 탈퇴하시겠습니까?</h6>
                        <p className="text-muted small">
                            이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.
                        </p>
                    </div>

                    {/* 선택한 탈퇴 사유 표시 */}
                    <div className="bg-light rounded p-3 mb-4">
                        <small className="text-muted d-block mb-1">선택한 탈퇴 사유:</small>
                        <div className="fw-medium">
                            {withdrawReasons.find(r => r.value === selectedReason)?.label}
                        </div>
                        {selectedReason === 'other' && otherReason && (
                            <div className="mt-2 small text-muted">
                                "{otherReason}"
                            </div>
                        )}
                    </div>

                    <Alert variant="danger" className="small mb-0">
                        <strong>마지막 경고:</strong> 탈퇴 후에는 같은 이메일로 재가입하더라도
                        기존 데이터를 복구할 수 없습니다.
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleCloseModals}>
                        취소
                    </Button>
                    <Button variant="danger" onClick={handleConfirmWithdraw}>
                        {profile?.providerType === "LOCAL" ? "계속 진행" : "탈퇴 완료"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* 비밀번호 확인 모달 - 로컬 계정만 */}
            {profile?.providerType === "LOCAL" && (
                <Modal show={showPasswordModal} onHide={handleCloseModals} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <i className="bi bi-shield-lock me-2 text-primary"></i>
                            본인 확인
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center mb-4">
                            <i className="bi bi-shield-check text-primary" style={{ fontSize: '2.5rem' }}></i>
                            <h6 className="mt-3">보안을 위해 비밀번호를 입력해주세요</h6>
                            <p className="text-muted small">
                                본인 확인을 위해 현재 비밀번호를 입력해야 합니다.
                            </p>
                        </div>

                        <Form.Group>
                            <Form.Label className="fw-medium">현재 비밀번호</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setPasswordError('');
                                    }}
                                    placeholder="비밀번호를 입력하세요"
                                    isInvalid={!!passwordError}
                                    autoFocus
                                />
                                <Button
                                    variant="outline-secondary"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                                </Button>
                                <Form.Control.Feedback type="invalid">
                                    {passwordError}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        {passwordError && (
                            <Alert variant="danger" className="mt-3 small">
                                <i className="bi bi-exclamation-circle me-2"></i>
                                {passwordError}
                            </Alert>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={handleCloseModals} disabled={loading}>
                            취소
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleFinalWithdraw}
                            disabled={loading || !password.trim()}
                        >
                            {loading ? (
                                <>
                                    <Spinner size="sm" className="me-2" />
                                    탈퇴 처리 중...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check-lg me-1"></i>
                                    탈퇴 완료
                                </>
                            )}
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
}