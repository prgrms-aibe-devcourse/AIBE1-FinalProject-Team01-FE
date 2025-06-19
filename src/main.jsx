import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/components/common/common.css";
import "./styles/components/main/MainPage.css";
import "./styles/components/common/NavigationBar.css";
import "./styles/components/common/FooterBar.css";
import "./styles/components/main/MainBoards.css";
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
