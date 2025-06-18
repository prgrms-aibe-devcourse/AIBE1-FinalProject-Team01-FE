import React from "react";

/**
 * @typedef {Object} CommunityPaginationProps
 * @property {number} page
 * @property {number} total
 * @property {(page: number) => void} onChange
 */

/**
 * 커뮤니티 페이지네이션
 * @param {CommunityPaginationProps} props
 */
export const CommunityPagination = ({ page, total, onChange }) => {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <nav className="d-flex justify-content-center my-4">
      <ul className="pagination">
        <li className={`page-item${page === 1 ? " disabled" : ""}`}>
          <button className="page-link" onClick={() => onChange(page - 1)}>
            &laquo;
          </button>
        </li>
        {pages.map((p) => (
          <li key={p} className={`page-item${p === page ? " active" : ""}`}>
            <button className="page-link" onClick={() => onChange(p)}>
              {p}
            </button>
          </li>
        ))}
        <li className={`page-item${page === total ? " disabled" : ""}`}>
          <button className="page-link" onClick={() => onChange(page + 1)}>
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};
