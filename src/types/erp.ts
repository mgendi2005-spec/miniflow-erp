/**
 * MiniFlow ERP - Type Definitions
 *
 * This file defines all the types used across the ERP system.
 * Understanding these types is the first step to understanding ERP architecture.
 */

// ============================================
// USER AND ROLES
// ============================================

export type UserRole =
  | "SALES_USER"
  | "SALES_MANAGER"
  | "WAREHOUSE_USER"
  | "FINANCE_USER";

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

// ============================================
// CATALOG DATA (Master Data)
// Catalog data is relatively static and referenced by transactional data
// ============================================

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  taxId: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  unitPrice: number; // in EGP
  unit: string; // "units", "kg", "liters", etc.
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
}

export interface PaymentTerm {
  id: string;
  name: string;
  daysUntilDue: number;
}

// ============================================
// CATALOG REGISTRY (All master data in one place)
// ============================================

export interface Catalog {
  customers: Customer[];
  products: Product[];
  warehouses: Warehouse[];
  paymentTerms: PaymentTerm[];
}

// ============================================
// INVENTORY DOMAIN
// ============================================

export interface InventoryStock {
  id: string;
  warehouseId: string;
  productId: string;
  availableQuantity: number;
  reservedQuantity: number;
}

export interface InventoryDomain {
  stock: InventoryStock[];
}

// ============================================
// SALES DOMAIN - WORKFLOW STATUS AND ACTIONS
// ============================================

/**
 * Order Status lifecycle:
 * DRAFT → PENDING_APPROVAL → CONFIRMED → READY_TO_SHIP → SHIPPED
 *       ↓
 *    CANCELLED
 *
 * PENDING_APPROVAL can also go back to DRAFT (rejection)
 */
export type SalesOrderStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "CONFIRMED"
  | "READY_TO_SHIP"
  | "SHIPPED"
  | "CANCELLED";

/**
 * Actions represent what a user can do to an order.
 * Not every action is allowed in every status.
 * Not every user role can perform every action.
 */
export type SalesOrderAction =
  | "CREATE"
  | "EDIT"
  | "SUBMIT"
  | "CANCEL"
  | "APPROVE"
  | "REJECT"
  | "RESERVE_STOCK"
  | "SHIP";

// ============================================
// SALES DOMAIN - TRANSACTIONAL DATA
// ============================================

export interface SalesOrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number; // quantity * unitPrice
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  warehouseId: string;
  paymentTermId: string;
  status: SalesOrderStatus;
  orderDate: string;
  items: SalesOrderItem[];
  totalAmount: number;
  notes?: string;
}

export interface SalesDomain {
  orders: SalesOrder[];
}

// ============================================
// FINANCE DOMAIN
// ============================================

export type InvoiceStatus = "DRAFT" | "FINALIZED";

export interface InvoiceItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  salesOrderId: string;
  customerId: string;
  invoiceDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  totalAmount: number;
}

export interface FinanceDomain {
  invoices: Invoice[];
}

// ============================================
// AUDIT TRAIL
// ============================================

/**
 * Every successful action is recorded in the audit trail.
 * This creates a complete audit history showing the lifecycle of transactional data.
 */
export interface AuditEntry {
  id: string;
  timestamp: string;
  entityType: "SalesOrder"; // Can extend to other entities
  entityId: string;
  action: SalesOrderAction;
  previousStatus: SalesOrderStatus | null;
  newStatus: SalesOrderStatus;
  performedByRole: UserRole;
  notes?: string;
}

// ============================================
// COMPLETE APPSTATE
// ============================================

export interface AppState {
  currentUser: User;
  catalog: Catalog;
  sales: SalesDomain;
  inventory: InventoryDomain;
  finance: FinanceDomain;
  auditTrail: AuditEntry[];
}
