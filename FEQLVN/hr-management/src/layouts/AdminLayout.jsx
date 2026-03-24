import { useState } from "react";
import { Link, Routes, Route, Navigate, useLocation } from "react-router-dom";
import DepartmentPage from "../pages/admin/DepartmentPage.jsx";
import EmployeePage from "../pages/admin/EmployeePage.jsx";
import UserPage from "../pages/admin/UserPage.jsx";
import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  {
    to: "/admin/employees",
    label: "Nhân viên",
    icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
    ),
  },
  {
    to: "/admin/departments",
    label: "Phòng ban",
    icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
        </svg>
    ),
  },
  {
    to: "/admin/users",
    label: "Người dùng",
    icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
    ),
  },
];

const PAGE_LABELS = {
  employees: "Nhân viên",
  departments: "Phòng ban",
  users: "Người dùng",
};

function NavItem({ item, active, onClick }) {
  return (
      <Link
          to={item.to}
          className={`nav-item ${active ? "nav-item--active" : ""}`}
          onClick={onClick}
      >
        <span className="nav-item__icon">{item.icon}</span>
        <span className="nav-item__label">{item.label}</span>
        {active && <span className="nav-item__dot" />}
      </Link>
  );
}

function AdminLayout() {
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop();
  const pageLabel = PAGE_LABELS[currentPath] || "Tổng quan";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const closeSidebar = () => setSidebarOpen(false);

  return (
      <>
        <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .admin-root {
          display: flex;
          min-height: 100vh;
          background: #f0f6ff;
          font-family: 'Lato', sans-serif;
        }

        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(10, 30, 55, 0.4);
          backdrop-filter: blur(2px);
          z-index: 30;
          animation: fade-in 0.2s ease;
        }
        .sidebar-overlay.is-open { display: block; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

        .admin-sidebar {
          width: 240px;
          min-width: 240px;
          background: #ffffff;
          border-right: 1px solid #e2edf8;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          z-index: 40;
          box-shadow: 4px 0 24px rgba(21, 101, 192, 0.06);
          transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 22px 20px;
          border-bottom: 1px solid #eef5fc;
        }
        .brand-logo {
          width: 40px; height: 40px;
          background: linear-gradient(140deg, #1976d2, #0d47a1);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 12px rgba(21, 101, 192, 0.3);
          flex-shrink: 0;
        }
        .brand-logo svg { width: 22px; height: 22px; }
        .brand-name { font-family: 'Nunito', sans-serif; font-size: 17px; font-weight: 800; color: #0d2137; letter-spacing: -0.4px; line-height: 1; }
        .brand-tagline { font-size: 11px; color: #94afc8; margin-top: 3px; }

        .sidebar-close-btn {
          display: none;
          margin-left: auto;
          background: #f0f6fc;
          border: none;
          border-radius: 8px;
          width: 30px; height: 30px;
          align-items: center; justify-content: center;
          cursor: pointer;
          color: #7a9ab8;
          flex-shrink: 0;
        }
        .sidebar-close-btn:hover { background: #ffebee; color: #d32f2f; }

        .sidebar-nav { flex: 1; padding: 20px 14px; overflow-y: auto; }
        .nav-group-label { font-size: 10px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase; color: #b8cfe4; padding: 0 8px; margin-bottom: 10px; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 10px; text-decoration: none; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 600; color: #6b8aab; margin-bottom: 3px; transition: all 0.17s ease; position: relative; }
        .nav-item:hover { background: #f0f8ff; color: #1565c0; }
        .nav-item--active { background: linear-gradient(100deg, #e8f4fd, #f0f9ff); color: #1565c0; font-weight: 700; border-left: 3px solid #1976d2; }
        .nav-item__icon { opacity: 0.75; display: flex; }
        .nav-item--active .nav-item__icon { opacity: 1; }
        .nav-item__label { flex: 1; }
        .nav-item__dot { width: 6px; height: 6px; background: #1976d2; border-radius: 50%; flex-shrink: 0; }

        .sidebar-footer { padding: 14px 18px; border-top: 1px solid #eef5fc; }
        .user-card { display: flex; align-items: center; gap: 10px; }
        .user-avatar { width: 36px; height: 36px; background: linear-gradient(135deg, #bbdefb, #90caf9); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 800; color: #1565c0; flex-shrink: 0; }
        .user-info { flex: 1; min-width: 0; }
        .user-name { font-size: 13px; font-weight: 700; color: #0d2137; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-role { font-size: 11px; color: #94afc8; margin-top: 1px; }
        .logout-btn { background: none; border: none; cursor: pointer; color: #b8cfe4; display: flex; align-items: center; padding: 6px; border-radius: 8px; transition: all 0.15s; flex-shrink: 0; }
        .logout-btn:hover { color: #e53935; background: #fff5f5; }

        .admin-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }

        .admin-topbar {
          height: 62px;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #e2edf8;
          display: flex;
          align-items: center;
          padding: 0 28px;
          gap: 12px;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .topbar-menu-btn {
          display: none;
          background: #f3f8fd;
          border: 1.5px solid #ddeaf8;
          border-radius: 10px;
          width: 38px; height: 38px;
          align-items: center; justify-content: center;
          cursor: pointer;
          color: #6b9ec8;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .topbar-menu-btn:hover { background: #e3f2fd; border-color: #90caf9; color: #1976d2; }

        .topbar-breadcrumb { display: flex; align-items: center; gap: 7px; font-family: 'Nunito', sans-serif; font-size: 13px; color: #94afc8; }
        .topbar-breadcrumb .sep { color: #c8dff0; }
        .topbar-breadcrumb .current { color: #1565c0; font-weight: 700; }
        .topbar-spacer { flex: 1; }

        .admin-content { flex: 1; overflow-y: auto; }
        .admin-content::-webkit-scrollbar { width: 5px; }
        .admin-content::-webkit-scrollbar-track { background: transparent; }
        .admin-content::-webkit-scrollbar-thumb { background: #b8d8f0; border-radius: 99px; }

        @media (max-width: 768px) {
          .admin-sidebar {
            position: fixed;
            left: 0; top: 0;
            height: 100vh;
            width: 260px;
            min-width: 260px;
            transform: translateX(-100%);
            z-index: 40;
          }
          .admin-sidebar.is-open {
            transform: translateX(0);
            box-shadow: 8px 0 40px rgba(10, 30, 55, 0.18);
          }
          .sidebar-close-btn { display: flex; }
          .topbar-menu-btn { display: flex; }
          .admin-topbar { padding: 0 16px; gap: 10px; }
          .topbar-breadcrumb { font-size: 14px; }
        }
      `}</style>

        <div className={`sidebar-overlay ${sidebarOpen ? "is-open" : ""}`} onClick={closeSidebar} />

        <div className="admin-root">
          {/* ── SIDEBAR ── */}
          <aside className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
            <div className="sidebar-brand">
              <div className="brand-logo">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div className="brand-name">System</div>
                <div className="brand-tagline">Quản trị hệ thống</div>
              </div>
              <button className="sidebar-close-btn" onClick={closeSidebar}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            <nav className="sidebar-nav">
              <div className="nav-group-label">Quản lý</div>
              {NAV_ITEMS.map((item) => (
                  <NavItem
                      key={item.to}
                      item={item}
                      active={location.pathname.includes(item.to.split("/").pop())}
                      onClick={closeSidebar}
                  />
              ))}
            </nav>

            <div className="sidebar-footer">
              <div className="user-card">
                <div className="user-avatar">AD</div>
                <div className="user-info">
                  <div className="user-name">Admin</div>
                  <div className="user-role">Quản trị viên</div>
                </div>
                <button
                    className="logout-btn"
                    title="Đăng xuất"
                    onClick={() => navigate("/")}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                  </svg>
                </button>
              </div>
            </div>
          </aside>

          {/* ── MAIN ── */}
          <div className="admin-main">
            <header className="admin-topbar">
              <button className="topbar-menu-btn" onClick={() => setSidebarOpen(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                </svg>
              </button>

              <div className="topbar-breadcrumb">
                <span>Admin</span>
                <span className="sep">›</span>
                <span className="current">{pageLabel}</span>
              </div>

              <div className="topbar-spacer" />
            </header>

            <main className="admin-content">
              <Routes>
                <Route index element={<Navigate to="departments" replace />} />
                <Route path="departments" element={<DepartmentPage />} />
                <Route path="employees" element={<EmployeePage />} />
                <Route path="users" element={<UserPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </>
  );
}

export default AdminLayout;