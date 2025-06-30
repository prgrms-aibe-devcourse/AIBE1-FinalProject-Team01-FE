import React from "react";
import { Outlet } from "react-router-dom";
import { NavigationBar } from "./NavigationBar";
import { FooterBar } from "./FooterBar";
import { ScrollToTop } from "./ScrollToTop";

export const Layout = () => {
  return (
    <>
      <ScrollToTop />
      <NavigationBar />
      <main
        style={{
          minHeight: "calc(100vh - 128px)",
          paddingTop: "70px",
          paddingBottom: "58px",
        }}
      >
        <Outlet />
      </main>
      <FooterBar />
    </>
  );
};
