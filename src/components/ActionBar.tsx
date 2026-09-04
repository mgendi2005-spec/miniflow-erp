/**
 * Action Bar Component
 * 
 * THIS IS THE KEY COMPONENT DEMONSTRATING DATA-DRIVEN WORKFLOW.
 * 
 * Instead of:
 *   if (order.status === "DRAFT") return <button>Submit</button>
 *   else if (order.status === "PENDING_APPROVAL") return <button>Approve</button>
 * 
 * We:
 *   1. Query the workflow configuration for allowed actions
 *   2. Render buttons dynamically from that configuration
 *   3. Add new statuses/actions only in configuration
 *   4. This component never changes (configuration-driven)
 */

import type { SalesOrder, SalesOrderAction, UserRole } from "../types/erp";
import type { WorkflowTransition } from "../config/salesOrderWorkflow";
import { getAvailableActions } from "../config/salesOrderWorkflow";
import "../styles/components.css";

interface ActionBarProps {
  order: SalesOrder;
  userRole: UserRole;
  onAction: (action: SalesOrderAction) => void;
  isLoading?: boolean;
}

export function ActionBar({
  order,
  userRole,
  onAction,
  isLoading = false,
}: ActionBarProps) {
  // Get allowed actions from CONFIGURATION, not from code
  const allowedActions = getAvailableActions(order.status, userRole);

  if (allowedActions.length === 0) {
    return <div className="action-bar empty">No actions available</div>;
  }

  return (
    <div className="action-bar">
      {allowedActions.map((transition: WorkflowTransition) => (
        <button
          key={transition.action}
          className={`action-button action-button-${transition.variant}`}
          onClick={() => onAction(transition.action)}
          disabled={isLoading}
          title={`${transition.label} (${order.status} → ${transition.toStatus})`}
        >
          {transition.label}
        </button>
      ))}
    </div>
  );
}
