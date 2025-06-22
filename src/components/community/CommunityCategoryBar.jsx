import React from "react";
import { Nav } from "react-bootstrap";
import { CATEGORY_MAP } from "../../pages/community/constants";
import "../../styles/components/community/community.css";

/**
 * @typedef {Object} CommunityCategoryBarProps
 * @property {string} selected
 * @property {(category: string) => void} onSelect
 * @property {Array<{key: string, label: string}>} tabs
 */

/**
 * 커뮤니티/함께해요 카테고리 바 (탭 형식)
 * @param {CommunityCategoryBarProps} props
 */
export const CommunityCategoryBar = ({ selected, onSelect, tabs }) => {
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
