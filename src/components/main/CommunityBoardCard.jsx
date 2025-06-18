import React from "react";

/**
 * @typedef {{ title: string, description: string, icon: string, onClick: function }} CommunityBoardCardProps
 */

/**
 * CommunityBoardCard Component
 * @param {CommunityBoardCardProps} props
 */
export const CommunityBoardCard = ({ title, description, icon, onClick }) => {
  return (
    <div className="community-board-card-wrapper" onClick={onClick}>
      <div className="community-board-card">
        <div className="card-content-top">
          <div className="card-image-placeholder">
            {icon && <img src={icon} alt="Board Icon" className="card-icon" />}
            {!icon && <div className="card-icon-shape"></div>}{" "}
            {/* Placeholder for icon */}
          </div>
        </div>
        <div className="card-content-bottom">
          <div className="card-title-text">{title}</div>
          <div className="card-description-text">{description}</div>
        </div>
      </div>
    </div>
  );
};
