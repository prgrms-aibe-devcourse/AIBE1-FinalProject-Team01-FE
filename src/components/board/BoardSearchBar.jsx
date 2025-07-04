import React, { useState } from "react";
import "../../styles/components/community/community.css";

/**
 * @typedef {Object} BoardSearchBarProps
 * @property {string} keyword
 * @property {(e: React.ChangeEvent<HTMLInputElement>) => void} onChange
 * @property {() => void} onWrite
 * @property {string} sort
 * @property {(sort: string) => void} onSortChange
 * @property {() => void} [onSearch]
 */

/**
 * 게시판 검색/글쓰기 바
 * @param {BoardSearchBarProps} props
 */
export const BoardSearchBar = ({
  keyword,
  onChange,
  onWrite,
  sort = "최신순",
  onSortChange = () => {},
  onSearch = () => {},
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const sortOptions = ["최신순", "조회순", "댓글순", "좋아요순"];

  const handleSortSelect = (option) => {
    setShowDropdown(false);
    onSortChange(option);
    // TODO: 정렬 옵션 변경 시 백엔드 데이터 요청 로직 추가 필요
  };

  const handleSearch = () => {
    // TODO: 검색 실행 시 백엔드 데이터 요청 로직 추가 필요
    onSearch();
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="community-searchbar-wrapper d-flex align-items-center justify-content-between my-3">
      <div className="position-relative">
        <button
          className="community-filter-btn"
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          <span className="filter-icon">≡</span> 필터
        </button>
        {showDropdown && (
          <ul className="community-filter-dropdown">
            {sortOptions.map((option) => (
              <li
                key={option}
                className={option === sort ? "active" : ""}
                onClick={() => handleSortSelect(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="d-flex align-items-center gap-2">
        <div className="community-search-input-wrapper">
          <input
            className="form-control community-search-input"
            type="text"
            placeholder="검색어를 입력해 주세요"
            value={keyword}
            onChange={onChange}
            onKeyDown={handleInputKeyDown}
          />
        </div>
        {onWrite && (
          <button
            className="community-write-btn d-flex align-items-center gap-1"
            onClick={onWrite}
          >
            <span>글쓰기</span>
          </button>
        )}
      </div>
    </div>
  );
};
