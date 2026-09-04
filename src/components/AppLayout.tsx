/**
 * App Layout Component
 *
 * Provides the main layout structure: header, sidebar, and content area
 */

import type { ReactNode } from "react";
import type { User, UserRole } from "../types/erp";
import { SAMPLE_USERS } from "../data/initialData";
import "../styles/layout.css";

interface AppLayoutProps {
  currentUser: User;
  onUserRoleChange: (role: UserRole) => void;
  onResetData: () => void;
  children: ReactNode;
  currentPage: "dashboard" | "sales" | "inventory" | "finance" | "catalogs";
  onNavigate: (
    page: "dashboard" | "sales" | "inventory" | "finance" | "catalogs",
  ) => void;
}

export function AppLayout({
  currentUser,
  onUserRoleChange,
  onResetData,
  children,
  currentPage,
  onNavigate,
}: AppLayoutProps) {
  return (
    <div className="app-layout">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">MiniFlow ERP</h1>
          <p className="app-subtitle">Learning Project</p>
        </div>

        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{currentUser.name}</span>
            <span className="user-role">{currentUser.role}</span>
          </div>

          <select
            className="role-switcher"
            value={currentUser.role}
            onChange={(e) => onUserRoleChange(e.target.value as UserRole)}
            title="Switch to test different roles"
          >
            {Object.entries(SAMPLE_USERS).map(([roleKey, user]) => (
              <option key={roleKey} value={roleKey}>
                {user.role}: {user.name}
              </option>
            ))}
          </select>

          <button
            className="reset-button"
            onClick={onResetData}
            title="Reset to initial demo data"
          >
            Reset Data
          </button>
        </div>
      </header>

      <div className="app-container">
        {/* Sidebar Navigation */}
        <aside className="sidebar">
          <nav className="nav-menu">
            <button
              className={`nav-item ${currentPage === "dashboard" ? "active" : ""}`}
              onClick={() => onNavigate("dashboard")}
            >
              📊 Dashboard
            </button>
            <button
              className={`nav-item ${currentPage === "sales" ? "active" : ""}`}
              onClick={() => onNavigate("sales")}
            >
              📋 Sales
            </button>
            <button
              className={`nav-item ${currentPage === "inventory" ? "active" : ""}`}
              onClick={() => onNavigate("inventory")}
            >
              📦 Inventory
            </button>
            <button
              className={`nav-item ${currentPage === "finance" ? "active" : ""}`}
              onClick={() => onNavigate("finance")}
            >
              💰 Finance
            </button>
            <button
              className={`nav-item ${currentPage === "catalogs" ? "active" : ""}`}
              onClick={() => onNavigate("catalogs")}
            >
              📚 Catalogs
            </button>
          </nav>

          <div className="sidebar-footer">
            <p className="version">v0.1.0</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
