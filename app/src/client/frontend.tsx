/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM. No content or preparation should be done here
 * and instead be put into the App component
 */

import {createRoot} from "react-dom/client";
import App from "@/client/App.tsx";

function start(): void {
    const root = createRoot(document.getElementById("root")!);
    root.render(<App/>);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
} else {
    start();
}
