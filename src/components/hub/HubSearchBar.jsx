import React, { useState, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import "../../styles/components/hub/hub.css";

/**
 * @typedef {Object} HubSearchBarProps
 * @property {string[]} courseNames
 * @property {number[]} batchNumbers
 * @property {(filters: object) => void} onSearch
 */

/**
 * 프로젝트 허브 전용 검색 및 필터링 바
 * @param {HubSearchBarProps} props
 */
export const HubSearchBar = ({
  courseNames,
  batchNumbers,
  onSearch,
  onWrite,
}) => {
  const [filters, setFilters] = useState({
    courseName: "",
    batchNumber: "",
    keyword: "",
  });

  // 초기 로드 시에만 검색 실행
  useEffect(() => {
    onSearch(filters);
  }, []); // 초기 한 번만 실행

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleKeywordKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(filters);
    }
  };

  return (
    <div className="hub-search-bar-wrapper py-3 rounded">
      <div className="row g-2 align-items-center flex-grow-1">
        <div className="col-12 col-md-3">
          <Form.Select
            name="courseName"
            value={filters.courseName}
            onChange={handleChange}
            aria-label="코스 선택"
          >
            <option value="">전체 코스</option>
            {courseNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Form.Select>
        </div>
        <div className="col-12 col-md-3">
          <Form.Select
            name="batchNumber"
            value={filters.batchNumber}
            onChange={handleChange}
            aria-label="기수 선택"
          >
            <option value="">전체 기수</option>
            {batchNumbers.map((num) => (
              <option key={num} value={num}>
                {num}기
              </option>
            ))}
          </Form.Select>
        </div>
        <div className="col-12 col-md-6">
          <InputGroup>
            <InputGroup.Text className="bg-white border-end-0">
              <svg
                width="16"
                height="16"
                fill="currentColor"
                className="text-muted"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </InputGroup.Text>
            <Form.Control
              name="keyword"
              value={filters.keyword}
              onChange={handleChange}
              onKeyPress={handleKeywordKeyPress}
              placeholder="프로젝트 검색"
              aria-label="검색어 입력"
              className="border-start-0"
              style={{ paddingLeft: '0.5rem' }}
            />
          </InputGroup>
        </div>
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
  );
};
