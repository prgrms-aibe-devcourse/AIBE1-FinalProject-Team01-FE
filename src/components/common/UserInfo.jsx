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

  const { nickname, image_url, devcourse_name } = user;

  return (
    <div className={`user-info d-flex align-items-center gap-2 ${className}`}>
      <img src={image_url} alt="프로필" className="author-img" />
      <span className="author-name">{nickname}</span>
      {devcourse_name && <span className="author-batch">{devcourse_name}</span>}
    </div>
  );
}
