/**
 * MiniFlow ERP - Main Application
 *
 * This is the root component that manages global state and navigation
 */

import { useState, useEffect } from "react";
import type { AppState, UserRole } from "./types/erp";
import { AppLayout } from "./components/AppLayout";
import { SalesPage } from "./features/sales/SalesPage";
import { InventoryPage } from "./features/inventory/InventoryPage";
import { FinancePage } from "./features/finance/FinancePage";
import { CatalogsPage } from "./features/catalogs/CatalogsPage";
import { Dashboard } from "./features/Dashboard";
import { loadAppState, saveAppState, resetAppState } from "./data/initialData";
import "./App.css";

type PageType = "dashboard" | "sales" | "inventory" | "finance" | "catalogs";

function App() {
  const [state, setState] = useState<AppState>(() => {
    // Try to load from localStorage on first render
    return loadAppState("SALES_USER");
  });
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  const handleUserRoleChange = (role: UserRole) => {
    const newState = {
      ...state,
      currentUser: { ...state.currentUser, role } as any,
    };
    setState(newState);
    saveAppState(newState);
  };

  const handleResetData = () => {
    if (
      confirm(
        "Are you sure you want to reset to the initial demo data? This will lose all changes.",
      )
    ) {
      const newState = resetAppState(state.currentUser.role);
      setState(newState);
    }
  };

  return (
    <AppLayout
      currentUser={state.currentUser}
      onUserRoleChange={handleUserRoleChange}
      onResetData={handleResetData}
      currentPage={currentPage}
      onNavigate={setCurrentPage}
    >
      {currentPage === "dashboard" && <Dashboard state={state} />}
      {currentPage === "sales" && (
        <SalesPage state={state} onStateChange={setState} />
      )}
      {currentPage === "inventory" && <InventoryPage state={state} />}
      {currentPage === "finance" && <FinancePage state={state} />}
      {currentPage === "catalogs" && <CatalogsPage state={state} />}
    </AppLayout>
  );
}

export default App;
