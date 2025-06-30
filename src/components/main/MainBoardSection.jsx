import React from "react";
import { useNavigate } from "react-router-dom";
import { MainBoardCard } from "./MainBoardCard";
import "../../styles/components/main/MainBoards.css";
import { Container } from "react-bootstrap";

/**
 * @typedef {{}} MainBoardSectionProps
 */

/**
 * MainBoardSection Component
 * @param {MainBoardSectionProps} props
 */
export const MainBoardSection = () => {
  const navigate = useNavigate();
  const boardData = [
    {
      title: "자유 게시판",
      description:
        "개발과 관련된 다양한 주제로 자유롭게 소통해요<br/>잡담, 정보 공유, 회고까지 모두 환영합니다",
      icon: "/src/assets/maincards/1.png",
      onClick: () => navigate("/community/FREE"),
    },
    {
      title: "함께해요",
      description: "프로젝트 팀원 구인부터 수강생들과 멘토링 매칭까지!",
      icon: "/src/assets/maincards/2.png",
      onClick: () => navigate("/together/GATHERING"),
    },
    {
      title: "IT 정보",
      description: "데브코스 수강 후기보고 프로그래머스 데브코스 수강생 되기",
      icon: "/src/assets/maincards/3.png",
      onClick: () => navigate("/info/REVIEW"),
    },
    {
      title: "DM",
      description:
        "수강생들과의 끈끈한 연결을 위한 DM. DM으로 다양한 수강생들을 만나보세요",
      icon: "/src/assets/maincards/4.png",
      onClick: () => navigate("/community/FREE"),
    },
    {
      title: "프로젝트 허브",
      description:
        "데브코스 중 진행한 프로젝트가 모여있어요<br/>수강생들의 완성도 높은 아이디어를 확인해 보세요",
      icon: "/src/assets/maincards/5.png",
      onClick: () => navigate("/HUB"),
    },
    {
      title: "중고 거래",
      description: "안 쓰는 서적부터 기계까지, IT 관련 제품들을 사고 팔아요",
      icon: "/src/assets/maincards/6.png",
      onClick: () => navigate("/together/MARKET"),
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
              <MainBoardCard
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
