import React from "react";

/**
 * @typedef {Object} CommunitySearchBarProps
 * @property {string} keyword
 * @property {(e: React.ChangeEvent<HTMLInputElement>) => void} onChange
 * @property {() => void} onWrite
 * @property {() => void} onFilter
 */

/**
 * 커뮤니티 검색/글쓰기 바
 * @param {CommunitySearchBarProps} props
 */
export const CommunitySearchBar = ({
  keyword,
  onChange,
  onWrite,
  onFilter,
}) => {
  return (
    <div className="d-flex align-items-center gap-2 my-3">
      <button className="btn btn-outline-secondary" onClick={onFilter}>
        필터
      </button>
      <input
        className="form-control"
        style={{ maxWidth: 300 }}
        type="text"
        placeholder="검색어를 입력해 주세요"
        value={keyword}
        onChange={onChange}
      />
      <button
        className="btn btn-primary d-flex align-items-center gap-1"
        onClick={onWrite}
      >
        <span>글쓰기</span>
      </button>
    </div>
  );
};
