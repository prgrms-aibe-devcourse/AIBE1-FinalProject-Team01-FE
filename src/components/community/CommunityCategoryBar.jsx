import React from "react";

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
  const categories = ["자유게시판", "QnA", "블로그/회고"];
  return (
    <ul className="nav nav-tabs mb-3">
      {categories.map((cat) => (
        <li className="nav-item" key={cat}>
          <button
            className={`nav-link${selected === cat ? " active" : ""}`}
            onClick={() => onSelect(cat)}
            type="button"
          >
            {cat}
          </button>
        </li>
      ))}
    </ul>
  );
};
