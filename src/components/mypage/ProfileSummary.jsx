import React, { useState, useEffect } from "react";
import { accountApi } from "../../services/accountApi";
import "../../styles/components/mypage/mypage.css";
import { TOPICS } from "../../constants/topics";

/**
 * @typedef {Object} ProfileSummaryProps
 * @property {function} [onEdit]
 * @property {function} [onChangePassword]
 */

/**
 * 회원 정보 요약 컴포넌트 (API 연동)
 * @param {ProfileSummaryProps} props
 */
export const ProfileSummary = ({ onEdit, onChangePassword, profile: initialProfile }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // 프로필 정보 로드
    useEffect(() => {
        if (!initialProfile) {
            loadProfile();
        }
    }, [initialProfile]);

    useEffect(() => {
        if (initialProfile) {
            setProfile(initialProfile);
            setLoading(false);
        }
    }, [initialProfile]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await accountApi.getMyProfile();
      setProfile(data);
    } catch (err) {
      setError('프로필 정보를 불러오는데 실패했습니다.');
      console.error('프로필 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  // 토픽명 한글 변환
  const getDevTrackName = (track) => {
    const trackNames = {
      'FRONTEND': '프론트엔드',
      'BACKEND': '백엔드',
      'FULL_STACK': '풀스택',
      'AI_BACKEND': 'AI 백엔드',
      'DATA_SCIENCE': '데이터 분석',
      'DATA_ENGINEERING': '데이터 엔지니어링',
    };
    return trackNames[track] || track;
  };

  const getTopicName = (key) => 
  TOPICS.find(topic => topic.key === key)?.label || key;


  const getProviderName = (provider) => {
      const providerNames = {
          'LOCAL': '일반',
          'GITHUB': '소셜(github)',
          'KAKAO': '소셜(kakao)',
      };
      return providerNames[provider] || provider;
  };

  // 로딩 상태
  if (loading) {
    return (
        <div className="mypage-card">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">로딩 중...</span>
            </div>
          </div>
        </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
        <div className="mypage-card">
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
            <button
                className="btn btn-outline-danger btn-sm ms-3"
                onClick={loadProfile}
            >
              다시 시도
            </button>
          </div>
        </div>
    );
  }

// ProfileSummary.jsx의 버튼 부분만 개선된 코드

    return (
        <div className="mypage-card">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h5
                    className="mb-0"
                    style={{
                        fontSize: '1.25rem',
                        color: '#495057',
                        fontWeight: '600'
                    }}
                >
                    회원 정보
                </h5>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-outline-primary"
                        onClick={onEdit}
                        style={{
                            borderRadius: '8px',
                            padding: '10px 20px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            borderColor: '#0d6efd',
                            color: '#0d6efd',
                            backgroundColor: 'transparent',
                            transition: 'all 0.2s ease',
                            minWidth: '100px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#0d6efd';
                            e.target.style.color = '#ffffff';
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 4px 8px rgba(13, 110, 253, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#0d6efd';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        <i className="bi bi-pencil-square"></i>
                        정보 수정
                    </button>
                    {profile.providerType === "LOCAL" && (
                    <button
                        className="btn btn-outline-secondary"
                        onClick={onChangePassword}
                        style={{
                            borderRadius: '8px',
                            padding: '10px 20px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            borderColor: '#6c757d',
                            color: '#6c757d',
                            backgroundColor: 'transparent',
                            transition: 'all 0.2s ease',
                            minWidth: '130px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#6c757d';
                            e.target.style.color = '#ffffff';
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 4px 8px rgba(108, 117, 125, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#6c757d';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        <i className="bi bi-shield-lock"></i>
                        비밀번호 변경
                    </button>
                    )}
                </div>
            </div>
        <div className="card mb-4">
          <div className="card-body">
            <div
                className="p-3 rounded"
                style={{
                  borderRadius: '12px'
                }}
            >
              <div className="d-flex align-items-start">
                <img
                    src={profile.imageUrl || "https://via.placeholder.com/96x96?text=User"}
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
                <div className="ms-4 flex-grow-1">
                  <div className="row g-3">
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
                        {getDevTrackName(profile.devcourseName) || 'AI'}
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
                        {profile.devcourseBatch}기
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
                              이름
                          </div>
                          <div
                              className="fw-semibold"
                              style={{
                                  fontSize: '1rem',
                                  color: '#212529'
                              }}
                          >
                              {profile.name || '이름'}
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
                              닉네임
                          </div>
                          <div
                              className="fw-semibold"
                              style={{
                                  fontSize: '1rem',
                                  color: '#212529'
                              }}
                          >
                              {profile.nickname || '닉네임'}
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
                              {profile.email}
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
                              {getProviderName(profile.providerType)}
                          </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 관심 토픽 섹션도 같은 스타일로 */}
            <div className="mt-4">
              <div
                  className="fw-medium mb-2"
                  style={{
                    fontSize: '1.1rem',
                    color: '#495057'
                  }}
              >
                관심 토픽
              </div>
              <div
                  className="p-3 rounded"
                  style={{
                    backgroundColor: '#f8f9fa',
                    fontSize: '0.95rem',
                    color: '#6c757d',
                    lineHeight: '1.5'
                  }}
              >
                {profile.topics && profile.topics.length > 0
                    ? profile.topics.map(topic => getTopicName(topic)).join(", ")
                    : "설정된 관심 토픽이 없습니다."
                }
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};