import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { HeroSection } from "../../components/common/HeroSection";
import { DMSidebar } from "../../components/dm/DMSidebar";
import { DMChatArea } from "../../components/dm/DMChatArea";
import heroChatImage from "../../assets/hero-chat.png";
import "../../styles/components/dm/dm.css";

/**
 * DM 페이지 메인 컴포넌트
 */
export default function DMPage() {
  const [selectedChatId, setSelectedChatId] = useState(null);

  return (
    <>
      <HeroSection backgroundImageSrc={heroChatImage} />
      <div className="py-4">
        <Container className="dm-main-container">
          <Row className="dm-content-row">
            <Col md={4} className="dm-sidebar-col">
              <DMSidebar
                selectedChatId={selectedChatId}
                onChatSelect={setSelectedChatId}
              />
            </Col>
            <Col md={8} className="dm-chat-col">
              <DMChatArea selectedChatId={selectedChatId} />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
