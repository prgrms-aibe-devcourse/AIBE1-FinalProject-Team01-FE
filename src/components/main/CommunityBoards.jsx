import React from "react";
import { CommunityBoardCard } from "./CommunityBoardCard";
import "../../styles/components/main/CommunityBoards.css";

/**
 * @typedef {{}} CommunityBoardsProps
 */

/**
 * CommunityBoards Component
 * @param {CommunityBoardsProps} props
 */
export const CommunityBoards = () => {
  const boardData = [
    {
      title: "자유 게시판",
      description:
        "개발과 관련된 다양한 주제로 자유롭게 소통해요<br/>잡담, 정보 공유, 회고까지 모두 환영합니다",
      icon: "/src/assets/icon-image.png", // 임시 아이콘 경로 (필요시 수정)
      onClick: () => console.log("자유 게시판 클릭"),
    },
    {
      title: "질문 및 토론",
      description:
        "공부 중 궁금한 내용을 물어보고 토론해요<br/>으쓱이의 답변도 받을 수 있어요",
      icon: "/src/assets/icon-comment.png", // 임시 아이콘 경로 (필요시 수정)
      onClick: () => console.log("질문 및 토론 클릭"),
    },
    {
      title: "프로젝트 허브",
      description:
        "데브코스 중 진행한 프로젝트가 모여있어요<br/>수강생들의 완성도 높은 아이디어를 확인해 보세요",
      icon: "/src/assets/icon-user.png", // 임시 아이콘 경로 (필요시 수정)
      onClick: () => console.log("프로젝트 허브 클릭"),
    },
    {
      title: "자유 게시판",
      description:
        "개발과 관련된 다양한 주제로 자유롭게 소통해요<br/>잡담, 정보 공유, 회고까지 모두 환영합니다",
      icon: "/src/assets/icon-image.png", // 임시 아이콘 경로 (필요시 수정)
      onClick: () => console.log("자유 게시판 클릭"),
    },
    {
      title: "질문 및 토론",
      description:
        "공부 중 궁금한 내용을 물어보고 토론해요<br/>으쓱이의 답변도 받을 수 있어요",
      icon: "/src/assets/icon-comment.png", // 임시 아이콘 경로 (필요시 수정)
      onClick: () => console.log("질문 및 토론 클릭"),
    },
    {
      title: "프로젝트 허브",
      description:
        "데브코스 중 진행한 프로젝트가 모여있어요<br/>수강생들의 완성도 높은 아이디어를 확인해 보세요",
      icon: "/src/assets/icon-user.png", // 임시 아이콘 경로 (필요시 수정)
      onClick: () => console.log("프로젝트 허브 클릭"),
    },
  ];

  return (
    <div className="community-boards-wrapper">
      <div className="community-boards-inner">
        <div className="community-boards-title-area">
          <div className="community-boards-title">아마추어스 커뮤니티</div>
        </div>
        <div className="community-cards-section">
          <div className="community-cards-container">
            {boardData.map((board, index) => (
              <CommunityBoardCard
                key={index}
                title={board.title}
                description={board.description}
                icon={board.icon}
                onClick={board.onClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
