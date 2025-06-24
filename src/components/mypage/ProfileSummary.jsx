import React from "react";

/**
 * @typedef {Object} ProfileSummaryProps
 * @property {string} [name]
 * @property {string} [nickname]
 * @property {string} [email]
 * @property {string[]} [topics]
 * @property {function} [onEdit]
 */

/**
 * 회원 정보 요약 컴포넌트
 * @param {ProfileSummaryProps} props
 */
export const ProfileSummary = ({
  name = "홍길동",
  nickname = "amateur01",
  email = "amateur01@email.com",
  topics = ["Frontend", "AI/CC"],
  onEdit,
}) => {
  return (
    <div className="card p-4 mb-4 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">회원 정보</h5>
        <button className="btn btn-outline-primary btn-sm" onClick={onEdit}>
          정보 수정
        </button>
      </div>
      <div className="mb-2">
        <strong>이름</strong>: {name}
      </div>
      <div className="mb-2">
        <strong>닉네임</strong>: {nickname}
      </div>
      <div className="mb-2">
        <strong>이메일</strong>: {email}
      </div>
      <div>
        <strong>관심 토픽</strong>: {topics.join(", ")}
      </div>
    </div>
  );
};
