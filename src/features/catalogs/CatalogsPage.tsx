/**
 * Catalogs Domain - Master Data Management
 */

import { useState } from "react";
import type { AppState } from "../../types/erp";
import "../../styles/components.css";

interface CatalogsPageProps {
  state: AppState;
}

type CatalogType = "customers" | "products" | "warehouses" | "paymentTerms";

export function CatalogsPage({ state }: CatalogsPageProps) {
  const [activeTab, setActiveTab] = useState<CatalogType>("customers");

  const tabStyle = (isActive: boolean) => ({
    padding: "10px 16px",
    border: "none",
    background: isActive ? "#007bff" : "#f0f0f0",
    color: isActive ? "white" : "#333",
    cursor: "pointer",
    borderRadius: "4px 4px 0 0",
    fontWeight: isActive ? "600" : "500",
    fontSize: "0.9rem",
  });

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h2>Master Data Catalogs</h2>
        <p style={{ color: "#666", marginBottom: "12px" }}>
          Catalogs are static reference data used by transactional documents.
          They define the universe of valid values for sales orders and other
          transactions.
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "12px" }}>
        <button
          onClick={() => setActiveTab("customers")}
          style={tabStyle(activeTab === "customers")}
        >
          👥 Customers
        </button>
        <button
          onClick={() => setActiveTab("products")}
          style={tabStyle(activeTab === "products")}
        >
          📦 Products
        </button>
        <button
          onClick={() => setActiveTab("warehouses")}
          style={tabStyle(activeTab === "warehouses")}
        >
          🏭 Warehouses
        </button>
        <button
          onClick={() => setActiveTab("paymentTerms")}
          style={tabStyle(activeTab === "paymentTerms")}
        >
          💳 Payment Terms
        </button>
      </div>

      {/* Customers Tab */}
      {activeTab === "customers" && (
        <div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Tax ID</th>
              </tr>
            </thead>
            <tbody>
              {state.catalog.customers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <strong>{customer.name}</strong>
                  </td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.city}</td>
                  <td style={{ fontFamily: "monospace", color: "#666" }}>
                    {customer.taxId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === "products" && (
        <div>
          <table className="data-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Description</th>
                <th>Unit Price</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {state.catalog.products.map((product) => (
                <tr key={product.id}>
                  <td style={{ fontFamily: "monospace", fontWeight: "600" }}>
                    {product.sku}
                  </td>
                  <td>
                    <strong>{product.name}</strong>
                  </td>
                  <td style={{ color: "#666", fontSize: "0.9rem" }}>
                    {product.description}
                  </td>
                  <td style={{ textAlign: "right", fontWeight: "600" }}>
                    {product.unitPrice.toFixed(2)} EGP
                  </td>
                  <td>{product.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Warehouses Tab */}
      {activeTab === "warehouses" && (
        <div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {state.catalog.warehouses.map((warehouse) => (
                <tr key={warehouse.id}>
                  <td>
                    <strong>{warehouse.name}</strong>
                  </td>
                  <td>{warehouse.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment Terms Tab */}
      {activeTab === "paymentTerms" && (
        <div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Days Until Due</th>
              </tr>
            </thead>
            <tbody>
              {state.catalog.paymentTerms.map((term) => (
                <tr key={term.id}>
                  <td>
                    <strong>{term.name}</strong>
                  </td>
                  <td>
                    {term.daysUntilDue === 0
                      ? "Due on Receipt"
                      : `Net ${term.daysUntilDue}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div
        style={{
          marginTop: "32px",
          padding: "16px",
          background: "#f0f0f0",
          borderRadius: "4px",
        }}
      >
        <h4>About Catalogs in MiniFlow ERP</h4>
        <ul style={{ color: "#666", lineHeight: "1.6" }}>
          <li>
            <strong>Catalog Data:</strong> Static master data that changes
            infrequently
          </li>
          <li>
            <strong>Transactional Data:</strong> Sales orders reference catalog
            data using IDs
          </li>
          <li>
            Catalogs represent the "valid universe" for transactions (e.g., only
            these customers, products, warehouses exist)
          </li>
          <li>
            In a real ERP, catalogs would have separate management interfaces
            with audit trails
          </li>
          <li>
            When a sales order references a customer by ID, the customer data
            cannot change retroactively
          </li>
        </ul>
      </div>
    </div>
  );
}
