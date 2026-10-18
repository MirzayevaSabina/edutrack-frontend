
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../index.css";

function Layout() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="app-layout">
            <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
                <div className="sidebar-brand">
                    <span className="brand-icon">E</span>
                    <span>EduTrack</span>
                </div>

                <p className="sidebar-label">MAIN MENU</p>

                <nav className="sidebar-nav">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `nav-link ${isActive ? "active" : ""}`
                        }
                        onClick={closeSidebar}
                    >
                        <span>▦</span> Dashboard
                    </NavLink>

                    <NavLink
                        to="/students"
                        className={({ isActive }) =>
                            `nav-link ${isActive ? "active" : ""}`
                        }
                        onClick={closeSidebar}
                    >
                        <span>♙</span> Students
                    </NavLink>

                    <NavLink
                        to="/departments"
                        className={({ isActive }) =>
                            `nav-link ${isActive ? "active" : ""}`
                        }
                        onClick={closeSidebar}
                    >
                        <span>▤</span> Departments
                    </NavLink>
                </nav>

                <div className="sidebar-bottom">
                    <button
                        type="button"
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        ↪ Log out
                    </button>
                </div>
            </aside>

            {sidebarOpen && (
                <button
                    type="button"
                    className="sidebar-overlay"
                    aria-label="Close navigation"
                    onClick={closeSidebar}
                />
            )}

            <div className="main-area">
                <header className="topbar">
                    <button
                        type="button"
                        className="menu-toggle"
                        aria-label="Toggle navigation"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        ☰
                    </button>

                    <span className="topbar-title">
                        Student Management System
                    </span>

                    <div className="topbar-user">
                        <span className="user-avatar">A</span>
                        <span>Admin</span>
                    </div>
                </header>

                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout;
