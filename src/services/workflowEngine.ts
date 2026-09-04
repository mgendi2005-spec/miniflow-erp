/**
 * Workflow Engine Service
 *
 * This service handles the BUSINESS LOGIC of executing workflow actions.
 * It uses the workflow configuration to determine valid transitions,
 * but it implements side effects like:
 * - Reserving stock from inventory
 * - Creating invoices in the finance domain
 * - Writing audit trail entries
 *
 * WHY THIS REMAINS IN CODE (not configuration):
 * - These are complex business rules that depend on multiple domains
 * - Stock reservation needs inventory checks (prevents overselling)
 * - Invoice creation requires calculating amounts, tax, due dates
 * - These rules change infrequently and require code review and testing
 * - Configuration works for state machines, not for complex side effects
 *
 * This separation (configuration for transitions, code for side effects)
 * is how real ERPs work. A backend API would return both:
 *   { allowedActions: [...], nextStatus: "...", sideEffects: [...] }
 */

import type {
  AppState,
  SalesOrder,
  SalesOrderAction,
  AuditEntry,
  InventoryStock,
  Invoice,
} from "../types/erp";
import { validateAndGetNextStatus } from "../config/salesOrderWorkflow";

export interface WorkflowActionResult {
  success: boolean;
  error?: string;
  newOrder?: SalesOrder;
  auditEntry?: AuditEntry;
}

export interface StockReservationResult {
  success: boolean;
  error?: string;
  updatedStock?: InventoryStock;
}

// ============================================
// MAIN WORKFLOW ACTION EXECUTOR
// ============================================

export function executeWorkflowAction(
  state: AppState,
  orderId: string,
  action: SalesOrderAction,
): { state: AppState; result: WorkflowActionResult } {
  const order = state.sales.orders.find((o) => o.id === orderId);

  if (!order) {
    return {
      state,
      result: { success: false, error: "Order not found" },
    };
  }

  // Validate the action is allowed
  const nextStatus = validateAndGetNextStatus(
    order.status,
    action,
    state.currentUser.role,
  );

  if (!nextStatus) {
    return {
      state,
      result: {
        success: false,
        error: `Action '${action}' not allowed for role '${state.currentUser.role}' in status '${order.status}'`,
      },
    };
  }

  // Handle special business logic for certain transitions
  let newState = state;

  // RESERVE STOCK: When moving from CONFIRMED to READY_TO_SHIP
  if (action === "RESERVE_STOCK") {
    const reservationResult = reserveStockForOrder(newState, order);
    if (!reservationResult.success) {
      return {
        state,
        result: {
          success: false,
          error: reservationResult.error,
        },
      };
    }
    newState = reservationResult.updatedState || newState;
  }

  // CREATE INVOICE: When moving from READY_TO_SHIP to SHIPPED
  if (action === "SHIP") {
    const invoiceResult = createInvoiceForOrder(newState, order);
    if (!invoiceResult.success) {
      return {
        state,
        result: {
          success: false,
          error: invoiceResult.error,
        },
      };
    }
    newState = invoiceResult.updatedState || newState;
  }

  // Update the order status
  const previousStatus = order.status;
  const updatedOrder: SalesOrder = {
    ...order,
    status: nextStatus,
  };

  // Create audit entry
  const auditEntry: AuditEntry = {
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    entityType: "SalesOrder",
    entityId: orderId,
    action,
    previousStatus,
    newStatus: nextStatus,
    performedByRole: state.currentUser.role,
  };

  // Return updated state
  const updatedState: AppState = {
    ...newState,
    sales: {
      ...newState.sales,
      orders: newState.sales.orders.map((o) =>
        o.id === orderId ? updatedOrder : o,
      ),
    },
    auditTrail: [...newState.auditTrail, auditEntry],
  };

  return {
    state: updatedState,
    result: {
      success: true,
      newOrder: updatedOrder,
      auditEntry,
    },
  };
}

// ============================================
// BUSINESS LOGIC: STOCK RESERVATION
// ============================================

function reserveStockForOrder(
  state: AppState,
  order: SalesOrder,
): {
  success: boolean;
  error?: string;
  updatedState?: AppState;
} {
  let updatedState = state;
  const warehouseId = order.warehouseId;

  // Check each order item
  for (const item of order.items) {
    const stock = state.inventory.stock.find(
      (s) => s.warehouseId === warehouseId && s.productId === item.productId,
    );

    if (!stock) {
      return {
        success: false,
        error: `Product ${item.productId} has no stock entry in warehouse ${warehouseId}`,
      };
    }

    const availableAfterReservation = stock.availableQuantity - item.quantity;

    if (availableAfterReservation < 0) {
      const product = state.catalog.products.find(
        (p) => p.id === item.productId,
      );
      const productName = product?.name || item.productId;
      return {
        success: false,
        error: `Insufficient stock for ${productName}. Available: ${stock.availableQuantity}, Required: ${item.quantity}`,
      };
    }

    // Reserve the stock
    const updatedStock = {
      ...stock,
      availableQuantity: availableAfterReservation,
      reservedQuantity: stock.reservedQuantity + item.quantity,
    };

    updatedState = {
      ...updatedState,
      inventory: {
        ...updatedState.inventory,
        stock: updatedState.inventory.stock.map((s) =>
          s.id === stock.id ? updatedStock : s,
        ),
      },
    };
  }

  return {
    success: true,
    updatedState,
  };
}

// ============================================
// BUSINESS LOGIC: INVOICE CREATION
// ============================================

function createInvoiceForOrder(
  state: AppState,
  order: SalesOrder,
): {
  success: boolean;
  error?: string;
  updatedState?: AppState;
} {
  const customer = state.catalog.customers.find(
    (c) => c.id === order.customerId,
  );
  const paymentTerm = state.catalog.paymentTerms.find(
    (p) => p.id === order.paymentTermId,
  );

  if (!customer || !paymentTerm) {
    return {
      success: false,
      error: "Customer or payment term not found",
    };
  }

  // Create invoice
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + paymentTerm.daysUntilDue);

  const invoice: Invoice = {
    id: `inv-${Date.now()}`,
    invoiceNumber: `INV-${Date.now().toString().slice(-8)}`,
    salesOrderId: order.id,
    customerId: order.customerId,
    invoiceDate: today.toISOString().split("T")[0],
    dueDate: dueDate.toISOString().split("T")[0],
    status: "DRAFT",
    items: order.items.map((item) => ({
      ...item,
      id: `inv-item-${Date.now()}-${item.productId}`,
    })),
    totalAmount: order.totalAmount,
  };

  const updatedState: AppState = {
    ...state,
    finance: {
      ...state.finance,
      invoices: [...state.finance.invoices, invoice],
    },
  };

  return {
    success: true,
    updatedState,
  };
}

// ============================================
// HELPER: GET AVAILABLE ACTIONS (FOR UI)
// ============================================

/**
 * Used by UI to render action buttons
 * This function checks workflow rules, not just business logic
 */
export function getAvailableActionsForOrder(
  _state: AppState,
  _order: SalesOrder,
): SalesOrderAction[] {
  // This is currently unused but available for future use
  // In the current implementation, ActionBar directly uses getAvailableActions
  return [];
}
