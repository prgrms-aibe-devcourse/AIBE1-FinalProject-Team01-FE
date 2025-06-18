import React from "react";
import mainhero from "../../assets/hero-main.png";

/**
 * @typedef {Object} HeroSectionProps
 */

/**
 * HeroSection 컴포넌트 (메인 히어로 섹션)
 * @param {HeroSectionProps} props
 */
export const HeroSection = () => {
  return (
    <section
      className="hero-section text-white d-flex flex-column justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${mainhero})`,
      }}
    >
      {/* Hero 섹션의 내용은 필요시 추가 */}
    </section>
  );
};
