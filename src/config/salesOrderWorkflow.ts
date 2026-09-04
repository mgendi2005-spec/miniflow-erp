/**
 * Sales Order Workflow Configuration
 * 
 * This file demonstrates DATA-DRIVEN workflow design.
 * 
 * Instead of hard-coding status checks throughout the app like:
 *   if (order.status === "DRAFT" && userRole === "SALES_USER") { showEditButton = true }
 * 
 * We define the entire workflow as data in this configuration.
 * The WorkflowEngine reads this configuration to determine:
 *   - What actions are allowed in each status
 *   - Which roles can perform each action
 *   - What the next status should be after an action
 * 
 * This approach has major advantages:
 * - Adding a new status requires only configuration changes, not code changes
 * - Business rules are centralized and readable
 * - The UI remains generic and does not need to change when workflow changes
 * - Non-developers (business analysts) can potentially read this configuration
 */

import type { SalesOrderStatus, SalesOrderAction, UserRole } from '../types/erp';

/**
 * Represents an action allowed in a specific status by a specific role
 */
export interface WorkflowTransition {
  // From this status
  fromStatus: SalesOrderStatus;
  // This action is allowed
  action: SalesOrderAction;
  // Only for these roles
  allowedRoles: UserRole[];
  // And leads to this status
  toStatus: SalesOrderStatus;
  // Human-readable button label
  label: string;
  // Optional styling (color of button)
  variant?: "primary" | "success" | "danger" | "secondary";
}

/**
 * The complete workflow configuration for Sales Orders
 * This is the single source of truth for all workflow rules.
 */
export const SALES_ORDER_WORKFLOW: WorkflowTransition[] = [
  // ========== DRAFT STATUS ==========
  {
    fromStatus: "DRAFT",
    action: "EDIT",
    allowedRoles: ["SALES_USER"],
    toStatus: "DRAFT",
    label: "Edit Order",
    variant: "secondary",
  },
  {
    fromStatus: "DRAFT",
    action: "SUBMIT",
    allowedRoles: ["SALES_USER"],
    toStatus: "PENDING_APPROVAL",
    label: "Submit for Approval",
    variant: "primary",
  },
  {
    fromStatus: "DRAFT",
    action: "CANCEL",
    allowedRoles: ["SALES_USER"],
    toStatus: "CANCELLED",
    label: "Cancel Order",
    variant: "danger",
  },

  // ========== PENDING_APPROVAL STATUS ==========
  {
    fromStatus: "PENDING_APPROVAL",
    action: "APPROVE",
    allowedRoles: ["SALES_MANAGER"],
    toStatus: "CONFIRMED",
    label: "Approve Order",
    variant: "success",
  },
  {
    fromStatus: "PENDING_APPROVAL",
    action: "REJECT",
    allowedRoles: ["SALES_MANAGER"],
    toStatus: "DRAFT",
    label: "Reject (Return to Draft)",
    variant: "danger",
  },

  // ========== CONFIRMED STATUS ==========
  {
    fromStatus: "CONFIRMED",
    action: "RESERVE_STOCK",
    allowedRoles: ["WAREHOUSE_USER"],
    toStatus: "READY_TO_SHIP",
    label: "Reserve Stock",
    variant: "primary",
  },

  // ========== READY_TO_SHIP STATUS ==========
  {
    fromStatus: "READY_TO_SHIP",
    action: "SHIP",
    allowedRoles: ["WAREHOUSE_USER"],
    toStatus: "SHIPPED",
    label: "Mark as Shipped",
    variant: "success",
  },

  // ========== SHIPPED STATUS ==========
  // No transitions - order is complete

  // ========== CANCELLED STATUS ==========
  // No transitions - order is closed
];

/**
 * Helper function to find all actions available in a specific status for a specific role
 * This is used by ActionBar component to render the correct buttons
 */
export function getAvailableActions(
  status: SalesOrderStatus,
  userRole: UserRole
): WorkflowTransition[] {
  return SALES_ORDER_WORKFLOW.filter(
    (transition) =>
      transition.fromStatus === status &&
      transition.allowedRoles.includes(userRole)
  );
}

/**
 * Helper function to validate if an action is allowed and get the next status
 * Used by business logic to execute actions
 */
export function validateAndGetNextStatus(
  currentStatus: SalesOrderStatus,
  action: SalesOrderAction,
  userRole: UserRole
): SalesOrderStatus | null {
  const transition = SALES_ORDER_WORKFLOW.find(
    (t) =>
      t.fromStatus === currentStatus &&
      t.action === action &&
      t.allowedRoles.includes(userRole)
  );

  return transition ? transition.toStatus : null;
}

/**
 * Helper to get the label for an action in a specific context
 */
export function getActionLabel(
  status: SalesOrderStatus,
  action: SalesOrderAction
): string {
  const transition = SALES_ORDER_WORKFLOW.find(
    (t) => t.fromStatus === status && t.action === action
  );
  return transition ? transition.label : action;
}

/**
 * Helper to get the variant (styling) for an action
 */
export function getActionVariant(
  status: SalesOrderStatus,
  action: SalesOrderAction
): string {
  const transition = SALES_ORDER_WORKFLOW.find(
    (t) => t.fromStatus === status && t.action === action
  );
  return transition?.variant || "secondary";
}
