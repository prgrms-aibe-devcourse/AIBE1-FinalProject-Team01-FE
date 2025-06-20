import React from "react";

/**
 * @typedef {Object} HeroSectionProps
 * @property {string} backgroundImageSrc - 배경 이미지 경로
 */

/**
 * HeroSection 컴포넌트 (공통 히어로 섹션)
 * @param {HeroSectionProps} props
 */
export const HeroSection = ({ backgroundImageSrc }) => {
  return (
    <section
      className="hero-section text-white d-flex flex-column justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${backgroundImageSrc})`,
      }}
    >
      {/* Hero 섹션의 내용은 필요시 추가 */}
    </section>
  );
};
