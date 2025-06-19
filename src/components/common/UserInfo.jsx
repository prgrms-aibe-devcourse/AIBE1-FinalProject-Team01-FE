import React from "react";

/**
 * @typedef {Object} UserInfoProps
 * @property {string} authorProfileImg
 * @property {string} author
 * @property {string} [devcourseName]
 * @property {string} [className]
 */

/**
 * 작성자(유저) 정보 표시용 공통 컴포넌트
 * @param {UserInfoProps} props
 */
export default function UserInfo({
  authorProfileImg,
  author,
  devcourseName,
  className = "",
}) {
  return (
    <div className={`user-info d-flex align-items-center gap-2 ${className}`}>
      <img src={authorProfileImg} alt="프로필" className="author-img" />
      <span className="author-name">{author}</span>
      {devcourseName && <span className="author-batch">{devcourseName}</span>}
    </div>
  );
}
