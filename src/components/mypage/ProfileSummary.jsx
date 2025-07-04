import React from "react";
import "../../styles/components/mypage/mypage.css";

/**
 * @typedef {Object} ProfileSummaryProps
 * @property {string} [name]
 * @property {string} [nickname]
 * @property {string} [email]
 * @property {string[]} [topics]
 * @property {function} [onEdit]
 * @property {function} [onChangePassword]
 * @property {string} [profileImg]
 * @property {string} [phone]
 * @property {boolean} [emailVerified]
 * @property {boolean} [phoneVerified]
 */

/**
 * 회원 정보 요약 컴포넌트
 * @param {ProfileSummaryProps} props
 */
export const ProfileSummary = ({
  name,
  nickname,
  email,
  topics,
  onEdit,
  onChangePassword,
  profileImg,
}) => {
  return (
    <div className="mypage-card">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">회원 정보</h5>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary btn-sm mypage-btn"
            onClick={onEdit}
          >
            정보 수정
          </button>
          <button
            className="btn btn-outline-secondary btn-sm mypage-btn"
            onClick={onChangePassword}
          >
            비밀번호 변경
          </button>
        </div>
      </div>
      <div className="d-flex align-items-center mb-3">
        <img
          src={profileImg || "https://via.placeholder.com/96x96?text=User"}
          alt="프로필"
          className="mypage-profile-img"
        />
        <div className="ms-4">
          <div className="fs-5 fw-bold mb-1">{nickname}</div>
          <div className="mb-1">{email}</div>
        </div>
      </div>
      <div className="mypage-label">관심 토픽</div>
      <div>{topics && topics.join(", ")}</div>
    </div>
  );
};
