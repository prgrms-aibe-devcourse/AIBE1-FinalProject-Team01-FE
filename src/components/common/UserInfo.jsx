import React from "react";

/**
 * @typedef {Object} UserInfoProps
 * @property {object} user - 사용자 정보 객체
 * @property {string} [className]
 */

/**
 * 작성자(유저) 정보 표시용 공통 컴포넌트
 * @param {UserInfoProps} props
 */
export default function UserInfo({ user, className = "" }) {
  if (!user) {
    return null;
  }

  const { nickname, profileImageUrl, devcourseName } = user;

  return (
    <div className={`user-info d-flex align-items-center gap-2 ${className}`}>
      <img src={profileImageUrl} alt="프로필" className="author-img" />
      <span className="author-name">{nickname}</span>
      {devcourseName && <span className="author-batch">{devcourseName}</span>}
    </div>
  );
}
