import React from "react";

/**
 * @typedef {Object} CommunityCategoryBarProps
 * @property {string} selected
 * @property {(category: string) => void} onSelect
 */

/**
 * 커뮤니티 카테고리 바
 * @param {CommunityCategoryBarProps} props
 */
export const CommunityCategoryBar = ({ selected, onSelect }) => {
  const categories = ["자유게시판", "QnA", "블로그/회고"];
  return (
    <div className="d-flex gap-2 my-3">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`btn ${
            selected === cat ? "btn-primary" : "btn-outline-secondary"
          }`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};
