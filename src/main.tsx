import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root")!;

// Enable dark mode by default for a more modern look
document.documentElement.classList.add("dark");

createRoot(rootElement).render(<App />);
