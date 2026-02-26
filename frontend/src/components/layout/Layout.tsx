import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import OwlAssistant from "../OwlAssistant";
import "../../index.css";
import { useState } from "react";

export default function Layout() {
    const [isLight, setIsLight] = useState(false);

    return (
        <div className={`dashboard-layout ${isLight ? "light-theme" : "dark-theme"}`}>
            <Sidebar isLight={isLight} setIsLight={setIsLight} />
            <main className="main-content">
                <Outlet />
            </main>
            <OwlAssistant />
        </div>
    );
}

