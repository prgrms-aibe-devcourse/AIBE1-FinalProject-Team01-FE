import React from "react";
import { Nav } from "react-bootstrap";
import "../../styles/components/community/community.css";

/**
 * @typedef {Object} BoardCategoryBarProps
 * @property {string} selected
 * @property {(category: string) => void} onSelect
 * @property {Array<{key: string, label: string}>} tabs
 */

/**
 * 게시판 카테고리 바 (탭 형식)
 * @param {BoardCategoryBarProps} props
 */
export const BoardCategoryBar = ({ selected, onSelect, tabs }) => {
  return (
    <ul className="community-category-bar nav nav-tabs mb-3">
      {tabs.map((tab) => (
        <li className="nav-item" key={tab.key}>
          <button
            className={`nav-link${selected === tab.key ? " active" : ""}`}
            onClick={() => onSelect(tab.key)}
            type="button"
          >
            {tab.label}
          </button>
        </li>
      ))}
    </ul>
  );
};
