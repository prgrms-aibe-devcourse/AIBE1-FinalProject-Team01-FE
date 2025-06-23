import React from "react";

/**
 * @typedef {Object} InfoPostInfoProps
 * @property {string} devcourseName
 * @property {number} devcourseBatch
 * @property {string} nickname
 * @property {string} boardType
 */

/**
 * Info 게시판용 작성자/코스 정보 표시 컴포넌트
 * @param {InfoPostInfoProps} props
 */
export default function InfoPostInfo({
  devcourseName,
  devcourseBatch,
  nickname,
  boardType,
}) {
  if (boardType === "REVIEW") {
    return (
      <span className="author-batch ms-auto text-end">
        {devcourseName} {devcourseBatch}기
      </span>
    );
  }
  return <span className="author-name">{nickname}</span>;
}
