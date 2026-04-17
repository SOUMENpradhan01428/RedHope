import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'   // ✅ ADD THIS
import { ThemeProvider } from "./context/ThemeContext";
import './index.css'
import App from './App.jsx'   // ⚠️ also fix case (App not app)

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)