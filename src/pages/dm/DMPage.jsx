import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { HeroSection } from "../../components/common/HeroSection";
import { DMContainer } from "../../components/dm/DMContainer";
import heroChatImage from "../../assets/hero-chat.png";
import "../../styles/components/dm/dm.css";

/**
 * DM 페이지 메인 컴포넌트
 */
export default function DMPage() {
  return (
    <>
      <HeroSection backgroundImageSrc={heroChatImage} />
      <div className="py-4">
        <DMContainer />
      </div>
    </>
  );
}
