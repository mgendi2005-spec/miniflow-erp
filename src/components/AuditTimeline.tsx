/**
 * Audit Timeline Component
 *
 * Displays the complete lifecycle of an entity through its audit trail.
 * Shows every action, who performed it, when, and the status change.
 */

import type { AuditEntry } from "../types/erp";
import "../styles/components.css";

interface AuditTimelineProps {
  entries: AuditEntry[];
}

const ACTION_LABELS: Record<string, string> = {
  CREATE: "Created",
  EDIT: "Edited",
  SUBMIT: "Submitted",
  APPROVE: "Approved",
  REJECT: "Rejected",
  CANCEL: "Cancelled",
  RESERVE_STOCK: "Stock Reserved",
  SHIP: "Shipped",
};

const ROLE_LABELS: Record<string, string> = {
  SALES_USER: "Sales User",
  SALES_MANAGER: "Sales Manager",
  WAREHOUSE_USER: "Warehouse Staff",
  FINANCE_USER: "Finance Officer",
};

export function AuditTimeline({ entries }: AuditTimelineProps) {
  if (entries.length === 0) {
    return <div className="audit-timeline empty">No audit history yet</div>;
  }

  return (
    <div className="audit-timeline">
      <div className="timeline-header">Activity Timeline</div>
      <div className="timeline">
        {entries.map((entry) => (
          <div key={entry.id} className="timeline-item">
            <div className="timeline-marker" />
            <div className="timeline-content">
              <div className="timeline-time">
                {new Date(entry.timestamp).toLocaleString("en-EG", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
              <div className="timeline-action">
                <strong>{ACTION_LABELS[entry.action] || entry.action}</strong>
              </div>
              <div className="timeline-details">
                <span className="role-badge">
                  {ROLE_LABELS[entry.performedByRole]}
                </span>
                <span className="status-transition">
                  {entry.previousStatus ? (
                    <>
                      <span className="status">{entry.previousStatus}</span>
                      <span className="arrow">→</span>
                      <span className="status">{entry.newStatus}</span>
                    </>
                  ) : (
                    <span className="status">→ {entry.newStatus}</span>
                  )}
                </span>
              </div>
              {entry.notes && (
                <div className="timeline-notes">{entry.notes}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
