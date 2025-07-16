import React from "react";
import { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import {
  followUser,
  unfollowUserApi,
  getModalInfo,
} from "../../services/followApi";
import { createDMRoom } from "../../services/dmApi";
import { useNavigate } from "react-router-dom";
import defaultImage from "../../assets/masseuki.png";
import "../../styles/components/user/userinfomodal.css";
import { isAuthorByNickname } from "../../utils/auth.js";

export default function UserInfoModal({ show, onHide, nickname, currentUser }) {
  const navigate = useNavigate();
  const [modalInfo, setModalInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [actioning, setActioning] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false);

  useEffect(() => {
    if (!show || !nickname) return;

    setLoadingInfo(true);
    getModalInfo(nickname)
      .then((data) => {
        setModalInfo(data);
        setIsFollowing(data.isFollowing);
      })
      .catch((err) => console.error("유저 정보 조회 실패:", err))
      .finally(() => setLoadingInfo(false));
  }, [show, nickname]);

  const handleToggle = async () => {
    if (!modalInfo?.userId) return;
    setActioning(true);
    try {
      if (isFollowing) {
        await unfollowUserApi(modalInfo.userId);
      } else {
        await followUser(modalInfo.userId);
      }
      setIsFollowing((prev) => !prev);
    } catch (err) {
      console.error("팔로우 토글 실패:", err);
    } finally {
      setActioning(false);
    }
  };

  const handleStartChat = async () => {
    if (!modalInfo?.userId) return;
    setCreatingChat(true);
    try {
      const newRoom = await createDMRoom(modalInfo.userId);
      onHide();
      navigate("/dm", {
        state: {
          roomId: newRoom.id,
        },
      });
    } catch (err) {
      console.error("채팅방 생성 실패:", err);
    } finally {
      setCreatingChat(false);
    }
  };

  const getDevCourseTrackLabel = (track) => {
    const trackLabels = {
      FRONTEND: "프론트엔드",
      BACKEND: "백엔드",
      FULL_STACK: "풀스택",
      AI_BACKEND: "AI/ML",
      DATA_SCIENCE: "데이터 분석",
      DATA_ENGINEERING: "데이터 엔지니어링",
    };
    return trackLabels[track] || track;
  };

  return (
    <Modal show={show} onHide={onHide} centered className="user-info-modal">
      <div className="profile-modal-content">
        {/* 헤더 */}
        <div className="profile-modal-header">
          <button className="close-btn" onClick={onHide}>
            ✕
          </button>
        </div>

        {/* 바디 */}
        <div className="profile-modal-body">
          {loadingInfo || !modalInfo ? (
            <div className="loading-container">
              <Spinner animation="border" className="loading-spinner" />
              <p>사용자 정보를 불러오는 중...</p>
            </div>
          ) : (
            <>
              {/* 프로필 섹션 */}
              <div className="profile-section">
                <div className="profile-image-container">
                  <img
                    src={modalInfo.profileImg || defaultImage}
                    alt={modalInfo.nickname}
                    className="profile-image"
                  />
                </div>
                <div className="profile-info">
                  <h2 className="profile-name">{modalInfo.nickname}</h2>
                  <div className="profile-badge">
                    {modalInfo.devcourseTrack && (
                      <span className="track-badge">
                        {getDevCourseTrackLabel(modalInfo.devcourseTrack)}
                      </span>
                    )}
                    {modalInfo.devcourseBatch && (
                      <span className="batch-info">
                        {modalInfo.devcourseBatch}기
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 통계 섹션 */}
              <div className="stats-section">
                <div className="stat-item">
                  <span className="stat-number">
                    {modalInfo.postCount || 0}
                  </span>
                  <span className="stat-label">게시글</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">
                    {modalInfo.follwerCount || 0}
                  </span>
                  <span className="stat-label">팔로워</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">
                    {modalInfo.followingCount || 0}
                  </span>
                  <span className="stat-label">팔로잉</span>
                </div>
              </div>

              {/* 액션 버튼 섹션 */}
              {!isAuthorByNickname(
                modalInfo.nickname,
                currentUser.nickname
              ) && (
                <div className="action-section">
                  <button
                    className={`action-btn ${
                      isFollowing ? "following" : "follow"
                    }`}
                    onClick={handleToggle}
                    disabled={actioning}
                  >
                    {actioning ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        className="btn-spinner"
                      />
                    ) : isFollowing ? (
                      <>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M20 6L9 17L4 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        팔로잉
                      </>
                    ) : (
                      <>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M12 5V19M5 12H19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                        팔로우
                      </>
                    )}
                  </button>

                  <button
                    className="action-btn chat"
                    onClick={handleStartChat}
                    disabled={loadingInfo || creatingChat}
                  >
                    {creatingChat ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        className="btn-spinner"
                      />
                    ) : (
                      <>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M8 12H16M8 8H16M8 16H12M7 20L3 16V4C3 3.46957 3.21071 2.96086 3.58579 2.58579C3.96086 2.21071 4.46957 2 5 2H19C19.5304 2 20.0391 2.21071 20.4142 2.58579C20.7893 2.96086 21 3.46957 21 4V16C21 16.5304 20.7893 17.0391 20.4142 17.4142C20.0391 17.7893 19.5304 18 19 18H7Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        메시지
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
