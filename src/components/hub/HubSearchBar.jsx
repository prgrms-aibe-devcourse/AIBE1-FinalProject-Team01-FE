import React, { useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
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
}) => {
  // 내부 상태로 필터 관리
  const [filters, setFilters] = useState({
    courseName: "",
    batchNumber: "",
    keyword: "",
  });

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 검색 실행
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <Form onSubmit={handleSubmit} className="bg-light p-3 rounded">
      <div className="row g-2 align-items-center">
        <div className="col-12 col-md-4">
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
        <div className="col-12 col-md-4">
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
        <div className="col-12 col-md-4">
          <InputGroup>
            <Form.Control
              name="keyword"
              value={filters.keyword}
              onChange={handleChange}
              placeholder="프로젝트, 기술 스택, 팀원 검색"
              aria-label="검색어 입력"
            />
            <Button variant="dark" type="submit">
              검색
            </Button>
          </InputGroup>
        </div>
      </div>
    </Form>
  );
};
