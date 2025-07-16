import React from "react";
import { useState, useEffect } from "react";
import { Modal, Button, Spinner, Image } from "react-bootstrap";
import {
  followUser,
  unfollowUser,
  getModalInfo,
} from "../../services/followApi";
import { createDMRoom } from "../../services/dmApi";
import { useNavigate } from "react-router-dom";
import defaultImage from "../../assets/masseuki.png";

export default function UserInfoModal({ show, onHide, nickname }) {
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
        // 서버에서 알려준 isFollowing 초기값
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
        await unfollowUser(modalInfo.userId);
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
      onHide(); // 모달 닫기
      navigate("/dm"); // DM 페이지로 이동
    } catch (err) {
      console.error("채팅방 생성 실패:", err);
    } finally {
      setCreatingChat(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="sm">
      <Modal.Header closeButton>
        <Modal.Title>사용자 정보</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">
        {loadingInfo || !modalInfo ? (
          <Spinner animation="border" />
        ) : (
          <>
            <Image
              src={modalInfo.imageUrl || defaultImage}
              roundedCircle
              width={60}
              height={60}
              alt="avatar"
            />
            <h5 className="mt-3">{modalInfo.nickname}</h5>
            <div className="text-muted small">
              {modalInfo.devCourseName} · {modalInfo.devCourseBatch}
            </div>
          </>
        )}
      </Modal.Body>

      <Modal.Footer className="justify-content-center">
        <Button
          variant={isFollowing ? "outline-secondary" : "primary"}
          onClick={handleToggle}
          disabled={actioning || loadingInfo}
        >
          {actioning ? (
            <Spinner as="span" animation="border" size="sm" />
          ) : isFollowing ? (
            "언팔로우"
          ) : (
            "팔로우"
          )}
        </Button>
        <Button
          variant="primary"
          onClick={handleStartChat}
          disabled={loadingInfo || creatingChat}
        >
          {creatingChat ? (
            <Spinner as="span" animation="border" size="sm" />
          ) : (
            "채팅 시작"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
