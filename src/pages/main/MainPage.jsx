import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "../../styles/components/main/MainPage.css";
import { MainBoardSection } from "../../components/main/MainBoardSection";
import { MainStatusSection } from "../../components/main/MainStatusSection";
import { PopularPosts } from "../../components/main/PopularPosts";
import mainhero from "../../assets/hero-main.png";
import { HeroSection } from "../../components/common/HeroSection";
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
      <HeroSection backgroundImageSrc={mainhero} />
      <PopularPosts />
      <MainBoardSection />
      <MainStatusSection />
      <CallToActionSection />
    </div>
  );
};
