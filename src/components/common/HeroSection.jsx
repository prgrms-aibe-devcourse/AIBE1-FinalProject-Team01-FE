import React from "react";

/**
 * @typedef {Object} HeroSectionProps
 * @property {string} backgroundImageSrc - 배경 이미지 경로
 * @property {React.ReactNode} [children] - HeroSection 내부에 표시할 내용(옵션)
 */

/**
 * HeroSection 컴포넌트 (공통 히어로 섹션)
 * @param {HeroSectionProps} props
 */
export const HeroSection = ({ backgroundImageSrc, children }) => {
  return (
    <section
      className="hero-section d-flex flex-column justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${backgroundImageSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        minHeight: "240px",
      }}
    >
      {children}
    </section>
  );
};
