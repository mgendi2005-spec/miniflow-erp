/**
 * Finance Domain - Invoice Management
 */

import type { AppState } from "../../types/erp";
import "../../styles/components.css";

interface FinancePageProps {
  state: AppState;
}

export function FinancePage({ state }: FinancePageProps) {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  const selectedInvoice = selectedInvoiceId
    ? state.finance.invoices.find((inv) => inv.id === selectedInvoiceId)
    : null;

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h2>Finance - Invoices</h2>
        <p style={{ color: "#666", marginBottom: "12px" }}>
          Invoices are automatically created in DRAFT status when an order is
          SHIPPED. Finance Users can review and manage invoices.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Invoices List */}
        <div style={{ gridColumn: selectedInvoiceId ? "1" : "1 / -1" }}>
          <h3>Invoices</h3>
          {state.finance.invoices.length === 0 ? (
            <p style={{ color: "#999" }}>
              No invoices yet. Create and ship a sales order to generate an invoice.
            </p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Invoice Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {state.finance.invoices.map((invoice) => {
                  const customer = state.catalog.customers.find(
                    (c) => c.id === invoice.customerId
                  );
                  const statusColor =
                    invoice.status === "FINALIZED" ? "#28a745" : "#ffc107";
                  const statusBg =
                    invoice.status === "FINALIZED" ? "#d4edda" : "#fff3cd";

                  return (
                    <tr
                      key={invoice.id}
                      onClick={() => setSelectedInvoiceId(invoice.id)}
                      style={{
                        cursor: "pointer",
                        background:
                          selectedInvoiceId === invoice.id ? "#e7f3ff" : "transparent",
                      }}
                    >
                      <td>
                        <strong>{invoice.invoiceNumber}</strong>
                      </td>
                      <td>{customer?.name || "Unknown"}</td>
                      <td>{invoice.totalAmount.toFixed(2)} EGP</td>
                      <td>{invoice.invoiceDate}</td>
                      <td>
                        <span
                          style={{
                            background: statusBg,
                            color: statusColor,
                            padding: "4px 8px",
                            borderRadius: "3px",
                            fontSize: "0.85rem",
                            fontWeight: "600",
                          }}
                        >
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Invoice Details */}
        {selectedInvoice && (
          <div>
            <h3>Invoice Details</h3>
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">{selectedInvoice.invoiceNumber}</div>
                <span
                  style={{
                    background:
                      selectedInvoice.status === "FINALIZED" ? "#d4edda" : "#fff3cd",
                    color:
                      selectedInvoice.status === "FINALIZED" ? "#155724" : "#856404",
                    padding: "4px 8px",
                    borderRadius: "3px",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                  }}
                >
                  {selectedInvoice.status}
                </span>
              </div>

              <div className="panel-body">
                <div style={{ marginBottom: "16px" }}>
                  <strong>Related Sales Order:</strong>
                  <div style={{ color: "#666", marginTop: "4px" }}>
                    {
                      state.sales.orders.find(
                        (o) => o.id === selectedInvoice.salesOrderId
                      )?.orderNumber
                    }
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <strong>Customer:</strong>
                  <div style={{ color: "#666", marginTop: "4px" }}>
                    {
                      state.catalog.customers.find(
                        (c) => c.id === selectedInvoice.customerId
                      )?.name
                    }
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <strong>Invoice Date:</strong>{" "}
                  <span style={{ color: "#666" }}>{selectedInvoice.invoiceDate}</span>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <strong>Due Date:</strong>{" "}
                  <span style={{ color: "#666" }}>{selectedInvoice.dueDate}</span>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <strong>Items:</strong>
                  <table className="data-table" style={{ marginTop: "8px" }}>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items.map((item) => {
                        const product = state.catalog.products.find(
                          (p) => p.id === item.productId
                        );
                        return (
                          <tr key={item.id}>
                            <td>{product?.name || item.productId}</td>
                            <td>{item.quantity}</td>
                            <td>{item.unitPrice.toFixed(2)} EGP</td>
                            <td>{item.lineTotal.toFixed(2)} EGP</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div style={{ marginBottom: "16px", paddingTop: "12px", borderTop: "1px solid #eee" }}>
                  <strong>Total:</strong>{" "}
                  <span style={{ fontSize: "1.2rem", color: "#007bff" }}>
                    {selectedInvoice.totalAmount.toFixed(2)} EGP
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: "32px",
          padding: "16px",
          background: "#f0f0f0",
          borderRadius: "4px",
        }}
      >
        <h4>About Finance in MiniFlow ERP</h4>
        <ul style={{ color: "#666", lineHeight: "1.6" }}>
          <li>
            Invoices are automatically created when a sales order is marked as SHIPPED
          </li>
          <li>
            Invoice status starts as DRAFT and can be finalized by Finance Users
          </li>
          <li>
            Due date is calculated based on the Payment Terms linked to the original
            order
          </li>
          <li>
            This demonstrates cross-domain communication: Sales → Inventory → Finance
          </li>
          <li>See the implementation in <code>createInvoiceForOrder()</code> in
            the workflow engine
          </li>
        </ul>
      </div>
    </div>
  );
}

import { useState } from "react";
