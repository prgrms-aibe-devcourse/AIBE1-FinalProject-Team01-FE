import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { DEVCOURSE_TRACKS, BATCHES } from "../../pages/hub/constants";
import "../../styles/components/hub/hub.css";

/**
 * @typedef {Object} HubSearchBarProps
 * @property {string} course
 * @property {(value: string) => void} onCourseChange
 * @property {string} batch
 * @property {(value: string) => void} onBatchChange
 * @property {string} keyword
 * @property {(e: React.ChangeEvent<HTMLInputElement>) => void} onChange
 * @property {() => void} onSearch
 */

/**
 * 프로젝트 허브 전용 검색 및 필터링 바
 * @param {HubSearchBarProps} props
 */
export const HubSearchBar = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    keyword: "",
    track: "all",
    batch: "all",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="d-flex flex-wrap gap-2 align-items-center bg-light p-3 rounded"
    >
      <Form.Select name="track" value={filters.track} onChange={handleChange}>
        <option value="all">전체 트랙</option>
        {DEVCOURSE_TRACKS.map((t) => (
          <option key={t.key} value={t.key}>
            {t.label}
          </option>
        ))}
      </Form.Select>
      <Form.Select name="batch" value={filters.batch} onChange={handleChange}>
        <option value="all">전체 기수</option>
        {BATCHES.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </Form.Select>
      <InputGroup>
        <Form.Control
          name="keyword"
          value={filters.keyword}
          onChange={handleChange}
          placeholder="프로젝트, 기술 스택, 팀원 검색"
        />
        <Button variant="dark" type="submit">
          검색
        </Button>
      </InputGroup>
    </Form>
  );
};
