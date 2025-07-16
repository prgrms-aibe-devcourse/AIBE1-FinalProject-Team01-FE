import React from "react";
import { HeroSection } from "../../components/common/HeroSection";
import { DMContainer } from "../../components/dm/DMContainer";
import heroChatImage from "../../assets/hero-chat.png";
import "../../styles/components/dm/dm.css";
import { useLocation } from "react-router-dom";

const DMPage = () => {
  const location = useLocation();
  const { roomId = null, messageId = null } = location.state || {};
  return (
    <>
      <HeroSection backgroundImageSrc={heroChatImage} />
      <div className="py-4">
        <DMContainer initialRoomId={roomId} initialMessageId={messageId} />
      </div>
    </>
  );
};
export default DMPage;
