/**
 * Inventory Domain - Stock Management
 */

import type { AppState } from "../../types/erp";
import "../../styles/components.css";

interface InventoryPageProps {
  state: AppState;
}

export function InventoryPage({ state }: InventoryPageProps) {
  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h2>Inventory Management</h2>
        <p style={{ color: "#666", marginBottom: "12px" }}>
          View warehouse stock levels. Reserved quantities are locked when sales
          orders reach READY_TO_SHIP status.
        </p>
      </div>

      <div style={{ display: "grid", gap: "24px" }}>
        {state.catalog.warehouses.map((warehouse) => {
          const warehouseStock = state.inventory.stock.filter(
            (s) => s.warehouseId === warehouse.id,
          );

          return (
            <div key={warehouse.id}>
              <h3>
                {warehouse.name}
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: "#999",
                    marginLeft: "12px",
                  }}
                >
                  {warehouse.location}
                </span>
              </h3>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Available</th>
                    <th>Reserved</th>
                    <th>Total</th>
                    <th>Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouseStock.map((stock) => {
                    const product = state.catalog.products.find(
                      (p) => p.id === stock.productId,
                    );
                    const total =
                      stock.availableQuantity + stock.reservedQuantity;
                    const utilization =
                      total > 0 ? (stock.reservedQuantity / total) * 100 : 0;

                    return (
                      <tr key={stock.id}>
                        <td>{product?.name || stock.productId}</td>
                        <td style={{ fontFamily: "monospace", color: "#666" }}>
                          {product?.sku}
                        </td>
                        <td>
                          <span
                            style={{
                              background: "#d4edda",
                              color: "#155724",
                              padding: "4px 8px",
                              borderRadius: "3px",
                            }}
                          >
                            {stock.availableQuantity}
                          </span>
                        </td>
                        <td>
                          <span
                            style={{
                              background: "#fff3cd",
                              color: "#856404",
                              padding: "4px 8px",
                              borderRadius: "3px",
                            }}
                          >
                            {stock.reservedQuantity}
                          </span>
                        </td>
                        <td>
                          <strong>{total}</strong>
                        </td>
                        <td>
                          <div
                            style={{
                              width: "100%",
                              background: "#eee",
                              borderRadius: "3px",
                              overflow: "hidden",
                              height: "20px",
                            }}
                          >
                            <div
                              style={{
                                width: `${utilization}%`,
                                background: "#ffc107",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.75rem",
                                color: "#333",
                              }}
                            >
                              {utilization > 10
                                ? `${utilization.toFixed(0)}%`
                                : ""}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: "32px",
          padding: "16px",
          background: "#f0f0f0",
          borderRadius: "4px",
        }}
      >
        <h4>About Inventory in MiniFlow ERP</h4>
        <ul style={{ color: "#666", lineHeight: "1.6" }}>
          <li>
            <strong>Available Quantity:</strong> Stock ready for new orders
          </li>
          <li>
            <strong>Reserved Quantity:</strong> Stock allocated to confirmed
            orders (locked when order reaches READY_TO_SHIP)
          </li>
          <li>
            <strong>Total:</strong> Available + Reserved
          </li>
          <li>
            When an order moves to <code>READY_TO_SHIP</code> via "Reserve
            Stock" action, inventory is updated by the workflow engine
          </li>
          <li>
            Insufficient stock prevents the reservation action (see code in{" "}
            <code>reserveStockForOrder()</code>)
          </li>
        </ul>
      </div>
    </div>
  );
}
