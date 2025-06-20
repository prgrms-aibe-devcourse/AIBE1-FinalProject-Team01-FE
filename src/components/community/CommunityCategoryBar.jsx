import React from "react";
import "../../styles/components/community/community.css";
import {
  CATEGORY_MAP,
  CATEGORY_KEYS,
} from "../../pages/community/communityData";

/**
 * @typedef {Object} CommunityCategoryBarProps
 * @property {string} selected
 * @property {(category: string) => void} onSelect
 */

/**
 * 커뮤니티 카테고리 바 (탭 형식)
 * @param {CommunityCategoryBarProps} props
 */
export const CommunityCategoryBar = ({ selected, onSelect }) => {
  return (
    <ul className="community-category-bar nav nav-tabs mb-3">
      {CATEGORY_KEYS.map((catKey) => (
        <li className="nav-item" key={catKey}>
          <button
            className={`nav-link${selected === catKey ? " active" : ""}`}
            onClick={() => onSelect(catKey)}
            type="button"
          >
            {CATEGORY_MAP[catKey]}
          </button>
        </li>
      ))}
    </ul>
  );
};
