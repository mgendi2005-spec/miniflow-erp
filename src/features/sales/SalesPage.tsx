/**
 * Sales Domain - Order List and Management
 */

import { useState } from "react";
import type { AppState, SalesOrder, SalesOrderAction } from "../../types/erp";
import { StatusBadge } from "../../components/StatusBadge";
import { ActionBar } from "../../components/ActionBar";
import { AuditTimeline } from "../../components/AuditTimeline";
import { executeWorkflowAction } from "../../services/workflowEngine";
import { saveAppState } from "../../data/initialData";
import "../../styles/components.css";

interface SalesPageProps {
  state: AppState;
  onStateChange: (newState: AppState) => void;
}

export function SalesPage({ state, onStateChange }: SalesPageProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const selectedOrder = selectedOrderId
    ? state.sales.orders.find((o) => o.id === selectedOrderId)
    : null;

  const handleCreateOrder = () => {
    if (state.currentUser.role !== "SALES_USER") {
      setError("Only Sales Users can create orders");
      return;
    }

    // Create a new draft order
    const newOrder: SalesOrder = {
      id: `order-${Date.now()}`,
      orderNumber: `ORD-${Date.now().toString().slice(-8)}`,
      customerId: state.catalog.customers[0].id,
      warehouseId: state.catalog.warehouses[0].id,
      paymentTermId: state.catalog.paymentTerms[0].id,
      status: "DRAFT",
      orderDate: new Date().toISOString().split("T")[0],
      items: [
        {
          id: `item-${Date.now()}`,
          productId: state.catalog.products[0].id,
          quantity: 1,
          unitPrice: state.catalog.products[0].unitPrice,
          lineTotal: state.catalog.products[0].unitPrice,
        },
      ],
      totalAmount: state.catalog.products[0].unitPrice,
      notes: "New order created",
    };

    const newState: AppState = {
      ...state,
      sales: {
        ...state.sales,
        orders: [...state.sales.orders, newOrder],
      },
    };

    onStateChange(newState);
    saveAppState(newState);
    setSelectedOrderId(newOrder.id);
    setError(null);
  };

  const handleAction = (action: SalesOrderAction) => {
    if (!selectedOrder) return;

    const { state: updatedState, result } = executeWorkflowAction(
      state,
      selectedOrder.id,
      action,
    );

    if (result.success) {
      onStateChange(updatedState);
      saveAppState(updatedState);
      setError(null);
    } else {
      setError(result.error || "Action failed");
    }
  };

  const filteredAuditEntries = selectedOrderId
    ? state.auditTrail.filter((entry) => entry.entityId === selectedOrderId)
    : [];

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h2>Sales Orders</h2>
        <p style={{ color: "#666", marginBottom: "12px" }}>
          Manage sales orders and workflows. Only Sales Users can create orders.
          Sales Managers approve them. Warehouse Users handle fulfillment.
        </p>

        <button
          onClick={handleCreateOrder}
          disabled={state.currentUser.role !== "SALES_USER"}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          + Create New Order
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}
      >
        {/* Orders List */}
        <div style={{ gridColumn: selectedOrderId ? "1" : "1 / -1" }}>
          <h3>Orders List</h3>
          {state.sales.orders.length === 0 ? (
            <p style={{ color: "#999" }}>
              No orders yet. Create one to get started.
            </p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {state.sales.orders.map((order) => {
                  const customer = state.catalog.customers.find(
                    (c) => c.id === order.customerId,
                  );
                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      style={{
                        cursor: "pointer",
                        background:
                          selectedOrderId === order.id
                            ? "#e7f3ff"
                            : "transparent",
                      }}
                    >
                      <td>
                        <strong>{order.orderNumber}</strong>
                      </td>
                      <td>{customer?.name || "Unknown"}</td>
                      <td>{order.totalAmount.toFixed(2)} EGP</td>
                      <td>
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Order Details */}
        {selectedOrder && (
          <div>
            <h3>Order Details</h3>
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">{selectedOrder.orderNumber}</div>
                <StatusBadge status={selectedOrder.status} />
              </div>

              <div className="panel-body">
                <div style={{ marginBottom: "16px" }}>
                  <strong>Order Date:</strong> {selectedOrder.orderDate}
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <strong>Customer:</strong>{" "}
                  {
                    state.catalog.customers.find(
                      (c) => c.id === selectedOrder.customerId,
                    )?.name
                  }
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <strong>Warehouse:</strong>{" "}
                  {
                    state.catalog.warehouses.find(
                      (w) => w.id === selectedOrder.warehouseId,
                    )?.name
                  }
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
                      {selectedOrder.items.map((item) => {
                        const product = state.catalog.products.find(
                          (p) => p.id === item.productId,
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

                <div
                  style={{
                    marginBottom: "16px",
                    paddingTop: "12px",
                    borderTop: "1px solid #eee",
                  }}
                >
                  <strong>Total Amount:</strong>{" "}
                  <span style={{ fontSize: "1.2rem", color: "#007bff" }}>
                    {selectedOrder.totalAmount.toFixed(2)} EGP
                  </span>
                </div>

                <ActionBar
                  order={selectedOrder}
                  userRole={state.currentUser.role}
                  onAction={handleAction}
                />
              </div>
            </div>

            {/* Audit Trail */}
            <h4 style={{ marginTop: "24px" }}>Activity History</h4>
            <AuditTimeline entries={filteredAuditEntries} />
          </div>
        )}
      </div>
    </div>
  );
}
