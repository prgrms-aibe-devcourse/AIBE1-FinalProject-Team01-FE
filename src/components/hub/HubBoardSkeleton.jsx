import React from "react";
import "../../styles/components/hub/hub-skeleton.css";

export default function HubBoardSkeleton({ count = 9 }) {
  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="col">
          <div className="card h-100 hub-card skeleton-card">
            <div className="hub-card-img-wrapper skeleton-img-wrapper">
              <div className="skeleton-img"></div>
              <span className="hub-card-likes skeleton-likes">
                <div className="skeleton-icon"></div>
                <div className="skeleton-text skeleton-text-small"></div>
              </span>
            </div>
            <div className="card-body d-flex flex-column">
              <div className="skeleton-text skeleton-course mb-2"></div>
              <div className="skeleton-text skeleton-title mb-3"></div>
              <div className="skeleton-text skeleton-content mb-2"></div>
              <div className="skeleton-text skeleton-content-short mb-3"></div>
              <div className="skeleton-text skeleton-members mb-2"></div>
              <div className="skeleton-text skeleton-period mb-3"></div>
              <div className="skeleton-tags mt-auto">
                <div className="skeleton-tag"></div>
                <div className="skeleton-tag"></div>
                <div className="skeleton-tag"></div>
              </div>
            </div>
            <div className="card-footer hub-card-footer">
              <div className="skeleton-button"></div>
              <div className="skeleton-button"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
