import React from "react";

/**
 * @typedef {Object} BoardCategoryBarProps
 * @property {Array<{id?: string, key?: string, label: string}>} tabs
 * @property {string} [selected]
 * @property {string} [activeTab]
 * @property {(tabId: string) => void} [onSelect]
 * @property {(tabId: string) => void} [onTabClick]
 */

/**
 * 게시판 상단의 카테고리(탭) 바 컴포넌트
 * @param {BoardCategoryBarProps} props
 */
export const BoardCategoryBar = (props) => {
  // 유연하게 props 처리: selected/onSelect/tabs.key 우선, 없으면 activeTab/onTabClick/tabs.id
  const { tabs, selected, onSelect, activeTab, onTabClick } = props;
  return (
    <ul className="community-category-bar nav nav-tabs mb-3">
      {tabs.map((tab) => {
        const tabKey = tab.key || tab.id;
        const isActive = (selected ?? activeTab) === tabKey;
        const handleClick = () => (onSelect || onTabClick)?.(tabKey);
        return (
          <li className="nav-item" key={tabKey}>
            <button
              className={`nav-link${isActive ? " active" : ""}`}
              onClick={handleClick}
              type="button"
            >
              {tab.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default BoardCategoryBar;
