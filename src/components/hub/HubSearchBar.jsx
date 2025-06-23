import React from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import "../../styles/components/hub/hub.css";

/**
 * @typedef {Object} HubSearchBarProps
 * @property {string[]} courseNames
 * @property {number[]} batchNumbers
 * @property {{ courseName: string, batchNumber: string, keyword: string }} filters
 * @property {(newFilters: object) => void} onFilterChange
 */

/**
 * 프로젝트 허브 전용 검색 및 필터링 바
 * @param {HubSearchBarProps} props
 */
export const HubSearchBar = ({
  courseNames,
  batchNumbers,
  filters,
  onFilterChange,
}) => {
  // 드롭다운/검색어 입력 시 바로 필터링
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  // 엔터 또는 버튼 클릭 시에도 필터링
  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ ...filters });
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
