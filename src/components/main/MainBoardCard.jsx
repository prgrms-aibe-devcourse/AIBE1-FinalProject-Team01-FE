import React from "react";

/**
 * @typedef {{ title: string, description: string, icon: string, onClick: function }} MainBoardCardProps
 */

/**
 * MainBoardCard Component
 * @param {MainBoardCardProps} props
 */
export const MainBoardCard = ({ title, description, icon, onClick }) => {
  return (
    <div
      className="card main-board-card"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <img src={icon} alt={title} className="main-board-card-img" />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p
          className="card-text"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </div>
  );
};
