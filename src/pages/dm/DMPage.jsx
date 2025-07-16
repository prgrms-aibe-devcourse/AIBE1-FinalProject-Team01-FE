import React from "react";
import { HeroSection } from "../../components/common/HeroSection";
import { DMContainer } from "../../components/dm/DMContainer";
import heroChatImage from "../../assets/hero-chat.png";
import "../../styles/components/dm/dm.css";

const DMPage = () => {
  return (
    <>
      <HeroSection backgroundImageSrc={heroChatImage} />
      <div className="py-4">
        <DMContainer />
      </div>
    </>
  );
};
export default DMPage;
