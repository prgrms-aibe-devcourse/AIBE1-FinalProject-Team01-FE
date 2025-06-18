import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "../../styles/components/main/MainPage.css";
import { CommunityBoards } from "../../components/main/CommunityBoards";
import { PopularPosts } from "../../components/main/PopularPosts";
import { HeroSection } from "../../components/main/HeroSection";
import { CommunityStatusSection } from "../../components/main/CommunityStatusSection";
import { CallToActionSection } from "../../components/main/CallToActionSection";

/**
 * @typedef {{}} MainPageProps
 */

/**
 * MainPage Component
 * @param {MainPageProps} props
 */
export const MainPage = () => {
  return (
    <div className="community-main-page">
      <HeroSection />
      <PopularPosts />
      <CommunityBoards />
      <CommunityStatusSection />
      <CallToActionSection />
    </div>
  );
};
