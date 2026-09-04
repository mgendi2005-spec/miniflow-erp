/**
 * Status Badge Component
 *
 * Displays the current status of an order with color coding.
 * This component is status-agnostic and will work with new statuses
 * added to the configuration.
 */

import type { SalesOrderStatus } from "../types/erp";
import "../styles/components.css";

interface StatusBadgeProps {
  status: SalesOrderStatus;
}

const STATUS_COLORS: Record<SalesOrderStatus, string> = {
  DRAFT: "#f0f0f0",
  PENDING_APPROVAL: "#fff3cd",
  CONFIRMED: "#d1ecf1",
  READY_TO_SHIP: "#d4edda",
  SHIPPED: "#28a745",
  CANCELLED: "#f8d7da",
};

const STATUS_TEXT_COLORS: Record<SalesOrderStatus, string> = {
  DRAFT: "#666",
  PENDING_APPROVAL: "#856404",
  CONFIRMED: "#0c5460",
  READY_TO_SHIP: "#155724",
  SHIPPED: "#fff",
  CANCELLED: "#721c24",
};

const STATUS_LABELS: Record<SalesOrderStatus, string> = {
  DRAFT: "Draft",
  PENDING_APPROVAL: "Pending Approval",
  CONFIRMED: "Confirmed",
  READY_TO_SHIP: "Ready to Ship",
  SHIPPED: "Shipped",
  CANCELLED: "Cancelled",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className="status-badge"
      style={{
        backgroundColor: STATUS_COLORS[status],
        color: STATUS_TEXT_COLORS[status],
      }}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
