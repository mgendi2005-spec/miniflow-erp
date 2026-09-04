/**
 * Dashboard - ERP Overview and Learning Guide
 */

import type { AppState } from "../types/erp";
import "../styles/components.css";

interface DashboardProps {
  state: AppState;
}

export function Dashboard({ state }: DashboardProps) {
  const totalOrders = state.sales.orders.length;
  const draftOrders = state.sales.orders.filter(
    (o: any) => o.status === "DRAFT",
  ).length;
  const shippedOrders = state.sales.orders.filter(
    (o: any) => o.status === "SHIPPED",
  ).length;
  const invoiceCount = state.finance.invoices.length;
  const auditCount = state.auditTrail.length;

  const orderValue = state.sales.orders.reduce(
    (sum: number, o: any) => sum + o.totalAmount,
    0,
  );

  return (
    <div>
      <h2>Dashboard</h2>
      <p style={{ color: "#666", marginBottom: "24px" }}>
        Welcome to MiniFlow ERP - a learning project demonstrating ERP
        architecture.
      </p>

      {/* Key Metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "16px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        >
          <div
            style={{ color: "#999", fontSize: "0.9rem", marginBottom: "8px" }}
          >
            Total Orders
          </div>
          <div
            style={{ fontSize: "2rem", fontWeight: "700", color: "#007bff" }}
          >
            {totalOrders}
          </div>
          <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "4px" }}>
            {draftOrders} draft, {shippedOrders} shipped
          </div>
        </div>

        <div
          style={{
            background: "white",
            padding: "16px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        >
          <div
            style={{ color: "#999", fontSize: "0.9rem", marginBottom: "8px" }}
          >
            Order Value
          </div>
          <div
            style={{ fontSize: "2rem", fontWeight: "700", color: "#28a745" }}
          >
            {orderValue.toFixed(0)} EGP
          </div>
          <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "4px" }}>
            Total order amounts
          </div>
        </div>

        <div
          style={{
            background: "white",
            padding: "16px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        >
          <div
            style={{ color: "#999", fontSize: "0.9rem", marginBottom: "8px" }}
          >
            Invoices
          </div>
          <div
            style={{ fontSize: "2rem", fontWeight: "700", color: "#ffc107" }}
          >
            {invoiceCount}
          </div>
          <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "4px" }}>
            Auto-generated from shipments
          </div>
        </div>

        <div
          style={{
            background: "white",
            padding: "16px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        >
          <div
            style={{ color: "#999", fontSize: "0.9rem", marginBottom: "8px" }}
          >
            Audit Entries
          </div>
          <div
            style={{ fontSize: "2rem", fontWeight: "700", color: "#dc3545" }}
          >
            {auditCount}
          </div>
          <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "4px" }}>
            Complete transaction history
          </div>
        </div>
      </div>

      {/* Learning Guide */}
      <div
        style={{
          background: "#f0f7ff",
          border: "1px solid #bbd7e8",
          borderRadius: "4px",
          padding: "20px",
        }}
      >
        <h3 style={{ marginTop: "0", color: "#005a87" }}>
          🎓 ERP Concepts in MiniFlow
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <h4 style={{ color: "#0066cc" }}>Business Domains</h4>
            <ul style={{ color: "#333", lineHeight: "1.8" }}>
              <li>
                <strong>Sales:</strong> Orders, customers, order workflow
              </li>
              <li>
                <strong>Inventory:</strong> Stock tracking, reservations,
                warehouses
              </li>
              <li>
                <strong>Finance:</strong> Invoices, payments, accounting
              </li>
              <li>
                <strong>Catalogs:</strong> Master data (products, customers,
                terms)
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: "#0066cc" }}>Data-Driven Workflow</h4>
            <ul style={{ color: "#333", lineHeight: "1.8" }}>
              <li>
                <strong>Configuration:</strong> Status transitions, roles,
                allowed actions
              </li>
              <li>
                <strong>Side Effects:</strong> Stock reservation, invoice
                creation
              </li>
              <li>
                <strong>Audit Trail:</strong> Every action recorded with
                timestamp
              </li>
              <li>
                <strong>Permissions:</strong> Role-based action availability
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: "#0066cc" }}>Transaction Lifecycle</h4>
            <p style={{ color: "#333", lineHeight: "1.8" }}>
              DRAFT → PENDING_APPROVAL → CONFIRMED → READY_TO_SHIP → SHIPPED
            </p>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              Each transition:
              <br />
              1. Is validated against workflow rules
              <br />
              2. Executes side effects if needed
              <br />
              3. Creates an audit entry
            </p>
          </div>

          <div>
            <h4 style={{ color: "#0066cc" }}>How to Test</h4>
            <ol style={{ color: "#333", lineHeight: "1.8" }}>
              <li>Switch role using the dropdown</li>
              <li>Go to Sales and create an order</li>
              <li>See available actions based on your role</li>
              <li>Progress order through workflow</li>
              <li>Watch inventory and invoices auto-update</li>
              <li>Check audit trail for complete history</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Key Files */}
      <div
        style={{
          marginTop: "32px",
          background: "white",
          border: "1px solid #ddd",
          borderRadius: "4px",
          padding: "20px",
        }}
      >
        <h3>Key Architecture Files</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <h4>Configuration-Driven</h4>
            <code
              style={{
                display: "block",
                background: "#f5f5f5",
                padding: "8px",
                borderRadius: "3px",
                marginBottom: "8px",
                fontSize: "0.85rem",
              }}
            >
              src/config/salesOrderWorkflow.ts
            </code>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              Defines all workflow rules: statuses, actions, roles, transitions.
              Add new statuses here, UI updates automatically.
            </p>
          </div>

          <div>
            <h4>Business Logic</h4>
            <code
              style={{
                display: "block",
                background: "#f5f5f5",
                padding: "8px",
                borderRadius: "3px",
                marginBottom: "8px",
                fontSize: "0.85rem",
              }}
            >
              src/services/workflowEngine.ts
            </code>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              Implements side effects: stock reservation, invoice creation,
              audit logging. Hard-coded business logic lives here.
            </p>
          </div>

          <div>
            <h4>Type Definitions</h4>
            <code
              style={{
                display: "block",
                background: "#f5f5f5",
                padding: "8px",
                borderRadius: "3px",
                marginBottom: "8px",
                fontSize: "0.85rem",
              }}
            >
              src/types/erp.ts
            </code>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              Complete data model: customers, products, orders, invoices, audit
              entries.
            </p>
          </div>

          <div>
            <h4>Generic UI</h4>
            <code
              style={{
                display: "block",
                background: "#f5f5f5",
                padding: "8px",
                borderRadius: "3px",
                marginBottom: "8px",
                fontSize: "0.85rem",
              }}
            >
              src/components/ActionBar.tsx
            </code>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              Queries configuration to render buttons. Works with any status or
              action. Never needs to change.
            </p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div
        style={{
          marginTop: "32px",
          padding: "16px",
          background: "#e7f3ff",
          borderRadius: "4px",
          borderLeft: "4px solid #007bff",
        }}
      >
        <h4 style={{ marginTop: "0" }}>📖 Next Steps</h4>
        <p style={{ color: "#333", lineHeight: "1.6" }}>
          Start by creating a sales order in the <strong>Sales</strong> tab.
          You'll see how the workflow configuration controls what actions are
          available. Try different roles to understand permissions. Then watch
          how domains interact: reserve stock in Inventory, see invoices
          auto-created in Finance, and check the audit trail.
        </p>
      </div>
    </div>
  );
}
