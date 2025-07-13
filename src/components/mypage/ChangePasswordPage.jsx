import React, { useState, useRef } from "react";
import { Form, Button, Alert, Spinner, InputGroup } from "react-bootstrap";
import { accountApi } from "../../services/accountApi";

export default function ChangePasswordPage({ onSave, onCancel }) {
    const [currentPw, setCurrentPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [newPwCheck, setNewPwCheck] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const newPwRef = useRef();
    const newPwCheckRef = useRef();

    // 비밀번호 표시/숨김 토글
    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    // 비밀번호 강도 검사
    const getPasswordStrength = (password) => {
        if (password.length === 0) return { level: 0, text: '', color: '' };

        let score = 0;
        if (password.length >= 8) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/\d/.test(password)) score += 1;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

        const levels = [
            { level: 0, text: '매우 약함', color: 'danger' },
            { level: 1, text: '약함', color: 'warning' },
            { level: 2, text: '보통', color: 'info' },
            { level: 3, text: '강함', color: 'success' },
            { level: 4, text: '매우 강함', color: 'success' }
        ];

        return levels[Math.min(score, 4)];
    };

    const isValidPassword = (password) => {
        return password.length >= 8 && /^(?=.*[a-zA-Z])(?=.*\d)/.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentPw || !newPw || !newPwCheck) {
            setError("모든 항목을 입력해 주세요.");
            return;
        }

        if (!isValidPassword(newPw)) {
            setError("새 비밀번호는 8자 이상, 알파벳과 숫자를 모두 포함해야 합니다.");
            newPwRef.current.focus();
            return;
        }

        if (newPw !== newPwCheck) {
            setError("새 비밀번호가 일치하지 않습니다.");
            newPwCheckRef.current.focus();
            return;
        }

        if (currentPw === newPw) {
            setError("현재 비밀번호와 새 비밀번호가 동일합니다.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");
            await accountApi.changePassword({
                currentPassword: currentPw,
                newPassword: newPw
            });

            setSuccess("비밀번호가 성공적으로 변경되었습니다.");

            // 폼 초기화
            setCurrentPw("");
            setNewPw("");
            setNewPwCheck("");

            // 성공 후 처리
            setTimeout(() => {
                onSave && onSave();
            }, 2000);

        } catch (err) {
            console.error('비밀번호 변경 실패:', err);

            if (err.response?.status === 400) {
                setError('현재 비밀번호가 올바르지 않습니다.');
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // 폼 초기화
        setCurrentPw("");
        setNewPw("");
        setNewPwCheck("");
        setError("");
        setSuccess("");
        setShowPasswords({
            current: false,
            new: false,
            confirm: false
        });

        // 부모 컴포넌트의 취소 콜백 호출
        onCancel && onCancel();
    };

    const passwordStrength = getPasswordStrength(newPw);

    return (
        <Form className="card p-4" onSubmit={handleSubmit}>
            <h5
                className="mb-4"
                style={{
                    fontSize: '1.25rem',
                    color: '#495057',
                    fontWeight: '600'
                }}
            >
                비밀번호 변경
            </h5>

            {/* 상태 메시지 */}
            {error && (
                <Alert
                    variant="danger"
                    className="mb-4"
                    style={{
                        borderRadius: '12px',
                        backgroundColor: '#f8d7da',
                        borderColor: '#f5c2c7',
                        color: '#842029'
                    }}
                >
                    <div className="d-flex align-items-center">
                        <i
                            className="bi bi-exclamation-triangle-fill me-2"
                            style={{ fontSize: '18px' }}
                        ></i>
                        <span className="fw-medium">{error}</span>
                    </div>
                </Alert>
            )}

            {success && (
                <Alert
                    variant="success"
                    className="mb-4"
                    style={{
                        borderRadius: '12px',
                        backgroundColor: '#d1e7dd',
                        borderColor: '#badbcc',
                        color: '#0f5132'
                    }}
                >
                    <div className="d-flex align-items-center">
                        <i
                            className="bi bi-check-circle-fill me-2"
                            style={{ fontSize: '18px' }}
                        ></i>
                        <span className="fw-medium">{success}</span>
                    </div>
                </Alert>
            )}

            {/* 비밀번호 변경 안내 */}
            <div
                className="p-3 rounded mb-4"
                style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px'
                }}
            >
                <div className="d-flex align-items-start">
                    <i
                        className="bi bi-info-circle text-primary me-3"
                        style={{ fontSize: '20px', marginTop: '2px' }}
                    ></i>
                    <div>
                        <h6
                            className="mb-2"
                            style={{
                                fontSize: '1rem',
                                color: '#495057',
                                fontWeight: '600'
                            }}
                        >
                            비밀번호 변경 안내
                        </h6>
                        <ul
                            className="mb-0 ps-3"
                            style={{
                                fontSize: '0.875rem',
                                color: '#6c757d',
                                lineHeight: '1.5'
                            }}
                        >
                            <li>비밀번호는 8자 이상이어야 합니다</li>
                            <li>영문자와 숫자를 모두 포함해야 합니다</li>
                            <li>특수문자를 포함하면 더 안전합니다</li>
                            <li>현재 비밀번호와 다른 비밀번호를 사용해주세요</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* 현재 비밀번호 */}
            <Form.Group className="mb-4">
                <Form.Label
                    className="fw-medium mb-2"
                    style={{
                        fontSize: '0.875rem',
                        color: '#6c757d'
                    }}
                >
                    현재 비밀번호
                </Form.Label>
                <InputGroup>
                    <Form.Control
                        type={showPasswords.current ? "text" : "password"}
                        value={currentPw}
                        onChange={(e) => setCurrentPw(e.target.value)}
                        placeholder="현재 비밀번호를 입력하세요"
                        style={{
                            fontSize: '1rem',
                            padding: '12px 16px',
                            borderColor: '#e0e0e0',
                            borderRadius: '8px 0 0 8px',
                            transition: 'all 0.2s ease'
                        }}
                        required
                    />
                    <Button
                        variant="outline-secondary"
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        style={{
                            borderColor: '#e0e0e0',
                            borderRadius: '0 8px 8px 0',
                            padding: '12px 16px',
                            color: '#6c757d'
                        }}
                    >
                        <i className={`bi bi-eye${showPasswords.current ? '-slash' : ''}`}></i>
                    </Button>
                </InputGroup>
            </Form.Group>

            {/* 새 비밀번호 */}
            <Form.Group className="mb-3">
                <Form.Label
                    className="fw-medium mb-2"
                    style={{
                        fontSize: '0.875rem',
                        color: '#6c757d'
                    }}
                >
                    새 비밀번호
                </Form.Label>
                <InputGroup>
                    <Form.Control
                        type={showPasswords.new ? "text" : "password"}
                        value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                        ref={newPwRef}
                        placeholder="새 비밀번호를 입력하세요"
                        style={{
                            fontSize: '1rem',
                            padding: '12px 16px',
                            borderColor: '#e0e0e0',
                            borderRadius: '8px 0 0 8px',
                            transition: 'all 0.2s ease'
                        }}
                        required
                    />
                    <Button
                        variant="outline-secondary"
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        style={{
                            borderColor: '#e0e0e0',
                            borderRadius: '0 8px 8px 0',
                            padding: '12px 16px',
                            color: '#6c757d'
                        }}
                    >
                        <i className={`bi bi-eye${showPasswords.new ? '-slash' : ''}`}></i>
                    </Button>
                </InputGroup>

                {/* 비밀번호 강도 표시 */}
                {(
                    <div
                        className="mt-3 p-3 rounded"
                        style={{
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #e9ecef'
                        }}
                    >
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <div className="d-flex align-items-center gap-2">
                                <span
                                    className="fw-medium"
                                    style={{
                                        fontSize: '0.875rem',
                                        color: '#6c757d'
                                    }}
                                >
                                    비밀번호 강도:
                                </span>
                                <span
                                    className={`badge bg-${passwordStrength.color}`}
                                    style={{
                                        fontSize: '0.75rem',
                                        fontWeight: '600'
                                    }}
                                >
                                    {passwordStrength.text}
                                </span>
                            </div>
                        </div>
                        <div
                            className="progress"
                            style={{
                                height: '6px',
                                borderRadius: '3px',
                                backgroundColor: '#e9ecef'
                            }}
                        >
                            <div
                                className={`progress-bar bg-${passwordStrength.color}`}
                                style={{
                                    width: `${(passwordStrength.level + 1) * 20}%`,
                                    borderRadius: '3px',
                                    transition: 'width 0.3s ease'
                                }}
                            ></div>
                        </div>

                        {/* 비밀번호 요구사항 체크리스트 */}
                        <div className="mt-3">
                            <div
                                className="fw-medium mb-2"
                                style={{
                                    fontSize: '0.875rem',
                                    color: '#6c757d'
                                }}
                            >
                                요구사항:
                            </div>
                            <div className="d-flex flex-column gap-1">
                                <div
                                    className="d-flex align-items-center"
                                    style={{ fontSize: '0.8rem' }}
                                >
                                    <i
                                        className={`bi bi-${newPw.length >= 8 ? 'check-circle-fill text-success' : 'circle text-muted'} me-2`}
                                    ></i>
                                    <span className={newPw.length >= 8 ? 'text-success' : 'text-muted'}>
                                        8자 이상
                                    </span>
                                </div>
                                <div
                                    className="d-flex align-items-center"
                                    style={{ fontSize: '0.8rem' }}
                                >
                                    <i
                                        className={`bi bi-${/[a-zA-Z]/.test(newPw) ? 'check-circle-fill text-success' : 'circle text-muted'} me-2`}
                                    ></i>
                                    <span className={/[a-zA-Z]/.test(newPw) ? 'text-success' : 'text-muted'}>
                                        영문자 포함
                                    </span>
                                </div>
                                <div
                                    className="d-flex align-items-center"
                                    style={{ fontSize: '0.8rem' }}
                                >
                                    <i
                                        className={`bi bi-${/\d/.test(newPw) ? 'check-circle-fill text-success' : 'circle text-muted'} me-2`}
                                    ></i>
                                    <span className={/\d/.test(newPw) ? 'text-success' : 'text-muted'}>
                                        숫자 포함
                                    </span>
                                </div>
                                <div
                                    className="d-flex align-items-center"
                                    style={{ fontSize: '0.8rem' }}
                                >
                                    <i
                                        className={`bi bi-${/[!@#$%^&*(),.?":{}|<>]/.test(newPw) ? 'check-circle-fill text-success' : 'circle text-muted'} me-2`}
                                    ></i>
                                    <span className={/[!@#$%^&*(),.?":{}|<>]/.test(newPw) ? 'text-success' : 'text-muted'}>
                                        특수문자 포함 (권장)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Form.Group>

            {/* 새 비밀번호 확인 */}
            <Form.Group className="mb-4">
                <Form.Label
                    className="fw-medium mb-2"
                    style={{
                        fontSize: '0.875rem',
                        color: '#6c757d'
                    }}
                >
                    새 비밀번호 확인
                </Form.Label>
                <InputGroup>
                    <Form.Control
                        type={showPasswords.confirm ? "text" : "password"}
                        value={newPwCheck}
                        onChange={(e) => setNewPwCheck(e.target.value)}
                        ref={newPwCheckRef}
                        placeholder="새 비밀번호를 다시 입력하세요"
                        style={{
                            fontSize: '1rem',
                            padding: '12px 16px',
                            borderColor: newPwCheck && newPw ?
                                (newPw === newPwCheck ? '#198754' : '#dc3545') : '#e0e0e0',
                            borderRadius: '8px 0 0 8px',
                            transition: 'all 0.2s ease'
                        }}
                        required
                    />
                    <Button
                        variant="outline-secondary"
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        style={{
                            borderColor: newPwCheck && newPw ?
                                (newPw === newPwCheck ? '#198754' : '#dc3545') : '#e0e0e0',
                            borderRadius: '0 8px 8px 0',
                            padding: '12px 16px',
                            color: '#6c757d'
                        }}
                    >
                        <i className={`bi bi-eye${showPasswords.confirm ? '-slash' : ''}`}></i>
                    </Button>
                </InputGroup>

                {/* 비밀번호 일치 확인 메시지 */}
                {newPwCheck && (
                    <div className="mt-2">
                        {newPw === newPwCheck ? (
                            <div
                                className="d-flex align-items-center"
                                style={{
                                    fontSize: '0.875rem',
                                    color: '#198754'
                                }}
                            >
                                <i className="bi bi-check-circle-fill me-2"></i>
                                <span className="fw-medium">비밀번호가 일치합니다</span>
                            </div>
                        ) : (
                            <div
                                className="d-flex align-items-center"
                                style={{
                                    fontSize: '0.875rem',
                                    color: '#dc3545'
                                }}
                            >
                                <i className="bi bi-exclamation-circle-fill me-2"></i>
                                <span className="fw-medium">비밀번호가 일치하지 않습니다</span>
                            </div>
                        )}
                    </div>
                )}
            </Form.Group>

            {/* 버튼 */}
            <div className="d-flex justify-content-end gap-2">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={loading}
                    style={{
                        borderRadius: '8px',
                        padding: '12px 24px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        minWidth: '80px',
                        transition: 'all 0.2s ease'
                    }}
                >
                    취소
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    style={{
                        borderRadius: '8px',
                        padding: '12px 24px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        minWidth: '120px',
                        transition: 'all 0.2s ease'
                    }}
                >
                    {loading ? (
                        <>
                            <Spinner
                                size="sm"
                                className="me-2"
                                style={{ width: '16px', height: '16px' }}
                            />
                            변경 중...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-shield-check me-2"></i>
                            비밀번호 변경
                        </>
                    )}
                </Button>
            </div>
        </Form>
    );
}