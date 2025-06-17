import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/components/common/common.css";
import "./styles/components/main/CommunityMainPage.css";
import "./styles/main/main.css";
import "./styles/components/common/NavigationBar.css";
import "./styles/components/common/FooterBar.css";
import "./styles/components/main/CommunityBoards.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
