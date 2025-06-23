import React from "react";

/**
 * @typedef {Object} BoardCategoryBarProps
 * @property {Array<{id: string, label: string}>} tabs
 * @property {string} activeTab
 * @property {(tabId: string) => void} onTabClick
 */

/**
 * 게시판 상단의 카테고리(탭) 바 컴포넌트
 * @param {BoardCategoryBarProps} props
 */
const BoardCategoryBar = ({ tabs, activeTab, onTabClick }) => {
  return (
    <div className="d-flex gap-2 mb-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`btn btn-outline-primary${
            activeTab === tab.id ? " active" : ""
          }`}
          onClick={() => onTabClick(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default BoardCategoryBar;
