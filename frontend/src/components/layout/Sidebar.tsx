import { NavLink } from "react-router-dom";
import { LayoutDashboard, Camera, FileText, Settings, ShieldAlert, Moon, Sun, LogOut } from "lucide-react";

interface SidebarProps {
    isLight: boolean;
    setIsLight: (val: boolean) => void;
}

export default function Sidebar({ isLight, setIsLight }: SidebarProps) {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <ShieldAlert className="logo-icon" />
                <h2>DeepInspection AI</h2>
            </div>

            <nav className="sidebar-nav">
                <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                >
                    <LayoutDashboard className="nav-icon" />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/dashboard/inspection"
                    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                >
                    <Camera className="nav-icon" />
                    <span>Upload</span>
                </NavLink>

                <NavLink
                    to="/dashboard/reports"
                    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                >
                    <FileText className="nav-icon" />
                    <span>Reports</span>
                </NavLink>

                <NavLink
                    to="/dashboard/domains"
                    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                >
                    <ShieldAlert className="nav-icon" />
                    <span>Domains</span>
                </NavLink>

                <NavLink
                    to="/dashboard/settings"
                    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                >
                    <Settings className="nav-icon" />
                    <span>Settings</span>
                </NavLink>

                <div className="theme-toggle-wrapper">
                    <button
                        className="theme-toggle-btn"
                        onClick={() => setIsLight(!isLight)}
                    >
                        {isLight ? <><Moon size={18} /> Dark Mode</> : <><Sun size={18} /> Light Mode</>}
                    </button>

                    <button
                        className="theme-toggle-btn"
                        style={{ marginTop: '0.5rem', color: '#EF4444' }}
                        onClick={() => window.location.href = '/'}
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </nav>
        </aside>
    );
}

