import React from "react";
import masseukiImg from "../../assets/masseuki.png";

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

    const { nickname, profileImageUrl, devCourseTrack, userProfileImg, devcourseName } = user;
    return (
        <div className={`user-info d-flex align-items-center gap-2 ${className}`}>
            <img
                src={profileImageUrl ?? userProfileImg ?? masseukiImg}
                alt="프로필"
                className="author-img"
            />
            <span className="author-name">{nickname}</span>
            {(devcourseName ?? devCourseTrack) && (
                <span className="author-batch">{devcourseName ?? devCourseTrack}</span>
            )}
        </div>
    );
}
