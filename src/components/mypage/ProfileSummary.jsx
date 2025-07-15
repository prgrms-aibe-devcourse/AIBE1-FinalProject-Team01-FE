import React, { useState, useEffect } from "react";
import { accountApi } from "../../services/accountApi";
import "../../styles/components/mypage/mypage.css";
import { TOPICS } from "../../constants/topics";
import { convertTrackFromApi } from "../../constants/devcourse";
import { getProviderName } from "../../utils/provider";
import masseukiImg from "../../assets/masseuki.png";


/**
 * @typedef {Object} ProfileSummaryProps
 * @property {function} [onEdit]
 * @property {function} [onChangePassword]
 */

/**
 * 회원 정보 요약 컴포넌트 (API 연동)
 * @param {ProfileSummaryProps} props
 */
export const ProfileSummary = ({ 
  onEdit, 
  onChangePassword, 
  onStudentVerification, 
  profile: initialProfile 
}) => {
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

  const getTopicName = (key) => 
    TOPICS.find(topic => topic.key === key)?.label || key;

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

  return (
    <div className="mypage-card">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="profile-summary-header">
          회원 정보
        </h5>
        <div className="d-flex gap-2">
          <button
            className="profile-summary-btn profile-summary-btn-primary"
            onClick={onEdit}
          >
            <i className="bi bi-pencil-square"></i>
            정보 수정
          </button>
          <button
            className="profile-summary-btn profile-summary-btn-success"
            onClick={onStudentVerification}
          >
            <i className="bi bi-shield-check"></i>
            수강생 인증
          </button>
          {profile.providerType === "LOCAL" && (
            <button
              className="profile-summary-btn profile-summary-btn-secondary"
              onClick={onChangePassword}
            >
              <i className="bi bi-shield-lock"></i>
              비밀번호 변경
            </button>
          )}
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-body">
          <div className="profile-summary-card-container p-3 rounded">
            <div className="d-flex align-items-start">
              <img
                src={profile.imageUrl || masseukiImg}
                alt="프로필"
                className="profile-summary-image rounded-circle border"
              />
              <div className="profile-summary-content flex-grow-1">
                <div className="row g-3">
                  <div className="col-6">
                    <div className="profile-summary-label">
                      과정명
                    </div>
                    <div className="profile-summary-value">
                      {profile.devcourseName ? convertTrackFromApi(profile.devcourseName) : '미설정'}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="profile-summary-label">
                      기수
                    </div>
                    <div className="profile-summary-value">
                      {profile.devcourseBatch ? `${profile.devcourseBatch}기` : '미설정'}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="profile-summary-label">
                      이름
                    </div>
                    <div className="profile-summary-value">
                      {profile.name || '이름'}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="profile-summary-label">
                      닉네임
                    </div>
                    <div className="profile-summary-value">
                      {profile.nickname || '닉네임'}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="profile-summary-label">
                      이메일
                    </div>
                    <div className="profile-summary-value">
                      {profile.email}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="profile-summary-label">
                      유형
                    </div>
                    <div className="profile-summary-value">
                      {getProviderName(profile.providerType)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 관심 토픽 섹션 */}
          <div className="mt-4">
            <div className="profile-summary-topics-title">
              관심 토픽
            </div>
            <div className="profile-summary-topics">
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