import React from "react";

/**
 * @typedef {Object} MyPageTabBarProps
 * @property {{key:string,label:string}[]} tabs
 * @property {string} activeTab
 * @property {function} onTabChange
 */

/**
 * 마이페이지 탭바
 * @param {MyPageTabBarProps} props
 */
export const MyPageTabBar = ({ tabs, activeTab, onTabChange }) => (
  <ul className="nav nav-tabs mt-3">
    {tabs.map((tab) => (
      <li className="nav-item" key={tab.key}>
        <button
          className={`nav-link${activeTab === tab.key ? " active" : ""}`}
          onClick={() => onTabChange(tab.key)}
          type="button"
        >
          {tab.label}
        </button>
      </li>
    ))}
  </ul>
);
