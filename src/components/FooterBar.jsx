import React from "react";
import { Container } from "react-bootstrap";

/**
 * @typedef {{}} FooterBarProps
 */

/**
 * FooterBar Component
 * @param {FooterBarProps} props
 */
export const FooterBar = () => {
  return (
    <footer
      style={{
        backgroundColor: "#1A202C",
        padding: "64px 0",
        textAlign: "center",
      }}
    >
      <Container style={{ maxWidth: "1200px" }}>
        <span
          style={{
            color: "#FBFBFD",
            fontSize: "12px",
            lineHeight: "1.25em",
            letterSpacing: "-1%",
          }}
        >
          Copyright 2025. Amateurs
        </span>
      </Container>
    </footer>
  );
};
