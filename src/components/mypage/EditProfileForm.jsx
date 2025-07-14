import React, { useState, useRef, useEffect } from "react";
import { Button, Form, Alert, Spinner } from "react-bootstrap";
import { accountApi } from "../../services/accountApi";
import { TOPICS } from "../../constants/topics";
import { getProviderName } from "../../utils/provider";

/**
 * 마이페이지 계정 관리(프로필 수정) 폼 (API 연동)
 */
export const EditProfileForm = ({ onSave, onCancel, initial }) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [checkingNickname, setCheckingNickname] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [nicknameStatus, setNicknameStatus] = useState(''); // 'available', 'unavailable', 'unchecked'

    const [formData, setFormData] = useState({
        name: '',
        nickname: '',
        imageUrl: '',
        topics: [],
        email: '',
        devcourseName: '',
        devcourseBatch: '',
        providerType: '',
    });

    const [originalData, setOriginalData] = useState(null);
    const [topicError, setTopicError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const fileInputRef = useRef();

    // initial 데이터가 변경될 때마다 폼 데이터 업데이트
    useEffect(() => {
        loadCurrentProfile();
    }, [initial]);

    // 닉네임이 변경되면 중복확인 상태 초기화
    useEffect(() => {
        if (formData.nickname !== originalData?.nickname) {
            setNicknameStatus('unchecked');
        } else {
            setNicknameStatus('available'); // 원래 닉네임이므로 사용 가능
        }
    }, [formData.nickname, originalData?.nickname]);

    const loadCurrentProfile = async () => {
        try {
            setLoading(true);
            setError('');
            setSuccess('');

            // initial props에서 최신 데이터 가져오기
            const profileData = {
                name: initial.name || '',
                nickname: initial.nickname || '',
                imageUrl: initial.imageUrl || initial.avatar || '',
                topics: initial.topics || [],
                email: initial.email || '',
                devcourseName: initial.devcourseName || initial.devcourseTrack || '',
                devcourseBatch: initial.devcourseBatch || '',
                providerType: initial.providerType || "LOCAL"
            };

            setFormData(profileData);
            setOriginalData(profileData);
            setNicknameStatus('available'); // 초기 닉네임은 사용 가능
        } catch (err) {
            setError('프로필 정보를 불러오는데 실패했습니다.');
            console.error('프로필 로드 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    const checkNicknameDuplicate = async () => {
        if (!formData.nickname.trim()) {
            setError('닉네임을 입력해주세요.');
            return;
        }

        if (formData.nickname === originalData?.nickname) {
            setNicknameStatus('available');
            return;
        }

        try {
            setCheckingNickname(true);
            setError('');

            const response = await accountApi.checkNicknameDuplicate(formData.nickname);

            if (response.available) {
                setNicknameStatus('available');
                setSuccess('사용 가능한 닉네임입니다.');
                setTimeout(() => setSuccess(''), 2000);
            } else {
                setNicknameStatus('unavailable');
                setError('이미 사용중인 닉네임입니다.');
            }
        } catch (err) {
            setError('닉네임 중복확인에 실패했습니다.');
            setNicknameStatus('unchecked');
        } finally {
            setCheckingNickname(false);
        }
    };

    const handleTopicClick = (topicKey) => {
        if (formData.topics.includes(topicKey)) {
            setFormData(prev => ({
                ...prev,
                topics: prev.topics.filter(t => t !== topicKey)
            }));
        } else if (formData.topics.length < 3) {
            setFormData(prev => ({
                ...prev,
                topics: [...prev.topics, topicKey]
            }));
        } else {
            setTopicError("관심 주제는 최대 3개까지 선택할 수 있습니다.");
            setTimeout(() => setTopicError(''), 3000);
            return;
        }
        setTopicError("");
    };

    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 파일 크기 체크 (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('이미지 파일 크기는 5MB 이하여야 합니다.');
                return;
            }

            // 임시 URL 생성
            const imageUrl = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, imageUrl }));
            setError('');
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = '이름을 입력해주세요.';
        }

        if (!formData.nickname.trim()) {
            errors.nickname = '닉네임을 입력해주세요.';
        }

        if (nicknameStatus !== 'available') {
            errors.nickname = '닉네임 중복확인을 완료해주세요.';
        }

        if (formData.topics.length === 0) {
            errors.topics = '관심 주제를 최소 1개 선택해주세요.';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSaving(true);
            setError('');
            setSuccess('');

            // 기본 프로필 정보 수정
            const basicProfileData = {
                name: formData.name,
                nickname: formData.nickname,
                imageUrl: formData.imageUrl
            };

            await accountApi.updateMyProfile(basicProfileData);

            // 토픽이 변경된 경우에만 토픽 업데이트
            if (JSON.stringify(formData.topics.sort()) !== JSON.stringify(originalData.topics.sort())) {
                await accountApi.updateMyTopics({ topics: formData.topics });
            }

            setSuccess('프로필이 성공적으로 수정되었습니다.');

            setTimeout(() => {
                // 최신 데이터로 부모 컴포넌트 콜백 호출
                onSave && onSave(formData);
            }, 1500);

        } catch (err) {
            console.error('프로필 수정 실패:', err);

            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.status === 409) {
                setError('이미 사용중인 닉네임입니다.');
            } else {
                setError('프로필 수정에 실패했습니다. 다시 시도해주세요.');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="card p-4">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3 text-muted">프로필 정보를 불러오는 중...</p>
                    </div>
                </div>
            </div>
        );
    }

    // 데이터가 아직 로드되지 않았으면 로딩 표시
    if (!formData.email) {
        return (
            <div className="card p-4">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3 text-muted">데이터를 준비하는 중...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Form className="card p-4" onSubmit={handleSubmit}>
            <h5 className="mb-4">계정 관리</h5>

            {/* 프로필 이미지 및 기본 정보 */}
            <div
                className="p-3 rounded mb-4"
                style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px'
                }}
            >
                <div className="d-flex align-items-start">
                    {/* 프로필 이미지 */}
                    <div style={{ position: 'relative' }}>
                        <img
                            src={formData.imageUrl || "https://via.placeholder.com/96x96?text=User"}
                            alt="프로필"
                            className="rounded-circle border"
                            style={{
                                width: '96px',
                                height: '96px',
                                objectFit: 'cover',
                                borderWidth: '3px',
                                borderColor: '#e9ecef'
                            }}
                        />
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
                            style={{
                                position: "absolute",
                                bottom: '4px',
                                right: '4px',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                padding: '0',
                                fontSize: '12px'
                            }}
                            onClick={() => fileInputRef.current.click()}
                        >
                            <i className="bi bi-camera"></i>
                        </Button>
                    </div>

                    {/* 기본 정보 */}
                    <div className="ms-4 flex-grow-1">
                        <div className="row g-3">
                            {/* 읽기 전용 필드들 */}
                            <div className="col-6">
                                <div
                                    className="fw-medium mb-1"
                                    style={{
                                        fontSize: '0.875rem',
                                        color: '#6c757d'
                                    }}
                                >
                                    과정명
                                </div>
                                <div
                                    className="fw-semibold"
                                    style={{
                                        fontSize: '1rem',
                                        color: '#212529'
                                    }}
                                >
                                    {formData.devcourseName}
                                </div>
                            </div>
                            <div className="col-6">
                                <div
                                    className="fw-medium mb-1"
                                    style={{
                                        fontSize: '0.875rem',
                                        color: '#6c757d'
                                    }}
                                >
                                    기수
                                </div>
                                <div
                                    className="fw-semibold"
                                    style={{
                                        fontSize: '1rem',
                                        color: '#212529'
                                    }}
                                >
                                    {formData.devcourseBatch}기
                                </div>
                            </div>
                            <div className="col-6">
                                <div
                                    className="fw-medium mb-1"
                                    style={{
                                        fontSize: '0.875rem',
                                        color: '#6c757d'
                                    }}
                                >
                                    이메일
                                </div>
                                <div
                                    className="fw-semibold"
                                    style={{
                                        fontSize: '1rem',
                                        color: '#212529'
                                    }}
                                >
                                    {formData.email}
                                </div>
                            </div>
                            <div className="col-6">
                                <div
                                    className="fw-medium mb-1"
                                    style={{
                                        fontSize: '0.875rem',
                                        color: '#6c757d'
                                    }}
                                >
                                    유형
                                </div>
                                <div
                                    className="fw-semibold"
                                    style={{
                                        fontSize: '1rem',
                                        color: '#212529'
                                    }}
                                >
                                    {getProviderName(formData.providerType)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 편집 가능한 필드들 */}
            <div className="mb-4">
                <h6
                    className="mb-3"
                    style={{
                        fontSize: '1.1rem',
                        color: '#495057'
                    }}
                >
                </h6>

                {/* 이름 */}
                <Form.Group className="mb-3">
                    <Form.Label
                        className="fw-medium"
                        style={{
                            fontSize: '0.875rem',
                            color: '#6c757d'
                        }}
                    >
                        이름
                    </Form.Label>
                    <Form.Control
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        isInvalid={!!validationErrors.name}
                        style={{
                            fontSize: '1rem'
                        }}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        {validationErrors.name}
                    </Form.Control.Feedback>
                </Form.Group>

                {/* 닉네임 + 중복확인 */}
                <Form.Group className="mb-3">
                    <Form.Label
                        className="fw-medium"
                        style={{
                            fontSize: '0.875rem',
                            color: '#6c757d'
                        }}
                    >
                        닉네임
                    </Form.Label>
                    <div className="d-flex gap-2 align-items-start">
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Form.Control
                                value={formData.nickname}
                                onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                                isInvalid={!!validationErrors.nickname}
                                className={
                                    nicknameStatus === 'available' && formData.nickname !== originalData?.nickname
                                        ? 'border-success'
                                        : nicknameStatus === 'unavailable'
                                            ? 'border-danger'
                                            : ''
                                }
                                style={{
                                    fontSize: '1rem',
                                    paddingRight: nicknameStatus === 'available' ? '40px' : '12px'
                                }}
                                required
                            />
                            {/* 입력 필드 내 체크 아이콘 */}
                            {nicknameStatus === 'available' && formData.nickname !== originalData?.nickname && (
                                <i
                                    className="bi bi-check-circle-fill text-success"
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        fontSize: '18px'
                                    }}
                                ></i>
                            )}
                        </div>
                        <Button
                            type="button"
                            variant="outline-primary"
                            disabled={checkingNickname || !formData.nickname.trim() || nicknameStatus === 'available'}
                            onClick={checkNicknameDuplicate}
                            style={{
                                minWidth: '90px',
                                height: '38px',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                borderRadius: '6px',
                                transition: 'all 0.2s ease'
                            }}
                            className={
                                nicknameStatus === 'available'
                                    ? 'btn-outline-success border-success text-success'
                                    : nicknameStatus === 'unavailable'
                                        ? 'btn-outline-danger border-danger text-danger'
                                        : ''
                            }
                        >
                            {checkingNickname ? (
                                <>
                                    <Spinner
                                        size="sm"
                                        style={{ width: '14px', height: '14px' }}
                                        className="me-1"
                                    />
                                    확인중
                                </>
                            ) : nicknameStatus === 'available' ? (
                                <>
                                    <i className="bi bi-check-lg me-1"></i>
                                </>
                            ) : nicknameStatus === 'unavailable' ? (
                                <>
                                    <i className="bi bi-x-lg me-1"></i>
                                    사용불가
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-search me-1"></i>
                                    중복확인
                                </>
                            )}
                        </Button>
                    </div>
                    <Form.Control.Feedback type="invalid">
                        {validationErrors.nickname}
                    </Form.Control.Feedback>
                    {/* 상태 메시지 */}
                    {nicknameStatus === 'available' && formData.nickname !== originalData?.nickname && (
                        <div
                            className="mt-2 d-flex align-items-center"
                            style={{
                                fontSize: '0.875rem',
                                color: '#198754'
                            }}
                        >
                            <i className="bi bi-check-circle-fill me-2"></i>
                            <span className="fw-medium">사용 가능한 닉네임입니다</span>
                        </div>
                    )}
                    {nicknameStatus === 'unavailable' && (
                        <div
                            className="mt-2 d-flex align-items-center"
                            style={{
                                fontSize: '0.875rem',
                                color: '#dc3545'
                            }}
                        >
                            <i className="bi bi-exclamation-circle-fill me-2"></i>
                            <span className="fw-medium">이미 사용중인 닉네임입니다</span>
                        </div>
                    )}
                    {formData.nickname === originalData?.nickname && (
                        <div
                            className="mt-2 d-flex align-items-center"
                            style={{
                                fontSize: '0.875rem',
                                color: '#6c757d'
                            }}
                        >
                            <i className="bi bi-info-circle me-2"></i>
                            <span>현재 사용중인 닉네임입니다</span>
                        </div>
                    )}
                </Form.Group>
            </div>

            {/* 관심 토픽 */}
            <Form.Group className="mb-4">
                <Form.Label
                    className="fw-medium"
                    style={{
                        fontSize: '1.1rem',
                        color: '#495057'
                    }}
                >
                    관심 토픽 (최소 1개, 최대 3개)
                </Form.Label>
                <div
                    className="p-3 rounded"
                    style={{
                        backgroundColor: '#f8f9fa'
                    }}
                >
                    <div className="d-flex flex-wrap gap-2 mb-3">
                        {TOPICS.map((topic) => {
                            const isSelected = formData.topics.includes(topic.key);
                            return (
                                <Button
                                    key={topic.key}
                                    type="button"
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => handleTopicClick(topic.key)}
                                    style={{
                                        borderRadius: '25px',
                                        padding: '8px 16px',
                                        fontSize: '0.875rem',
                                        fontWeight: isSelected ? '700' : '500',
                                        border: isSelected ? '2px solid #0d6efd' : '2px solid #dee2e6',
                                        backgroundColor: isSelected ? '#e7f3ff' : '#ffffff',
                                        color: isSelected ? '#0d6efd' : '#6c757d',
                                        transition: 'all 0.2s ease',
                                        minHeight: '36px'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isSelected) {
                                            e.target.style.borderColor = '#adb5bd';
                                            e.target.style.backgroundColor = '#f8f9fa';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isSelected) {
                                            e.target.style.borderColor = '#dee2e6';
                                            e.target.style.backgroundColor = '#ffffff';
                                        }
                                    }}
                                >
                                    {topic.label}
                                </Button>
                            );
                        })}
                    </div>

                    {topicError && (
                        <div className="text-danger mb-2" style={{ fontSize: '0.875rem' }}>
                            <i className="bi bi-exclamation-triangle me-1"></i>
                            {topicError}
                        </div>
                    )}

                    {validationErrors.topics && (
                        <div className="text-danger mb-2" style={{ fontSize: '0.875rem' }}>
                            <i className="bi bi-exclamation-triangle me-1"></i>
                            {validationErrors.topics}
                        </div>
                    )}

                    <div
                        className="text-muted"
                        style={{ fontSize: '0.875rem' }}
                    >
                        <strong>선택된 토픽 ({formData.topics.length}/3):</strong> {
                        formData.topics.length > 0
                            ? formData.topics.map(topicKey =>
                                TOPICS.find(t => t.key === topicKey)?.label
                            ).join(", ")
                            : "없음"
                    }
                    </div>
                </div>
            </Form.Group>

            {/* 버튼 */}
            <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" type="button" onClick={onCancel} disabled={saving}
                style={{
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    minWidth: '120px',
                    transition: 'all 0.2s ease'
                }}>
                    취소
                </Button>
                <Button variant="primary" type="submit" disabled={saving} style={{
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    minWidth: '120px',
                    transition: 'all 0.2s ease'}}>
                    {saving ? (
                        <>
                            <Spinner size="sm" className="me-2" />
                            저장 중...
                        </>
                    ) : (
                        '저장'
                    )}
                </Button>
            </div>
        </Form>
    );
};