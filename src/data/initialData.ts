/**
 * Initial Sample Data
 * 
 * This file contains sample Egyptian businesses and products
 * to demonstrate the ERP system with realistic data.
 */

import type {
  AppState,
  Customer,
  Product,
  Warehouse,
  PaymentTerm,
  InventoryStock,
  User,
  UserRole,
} from "../types/erp";

// ============================================
// SAMPLE CATALOGS (MASTER DATA)
// ============================================

const SAMPLE_CUSTOMERS: Customer[] = [
  {
    id: "cust-1",
    name: "Ahmed Trading Co.",
    email: "contact@ahmedtrading.eg",
    phone: "+20 100 123 4567",
    city: "Cairo",
    country: "Egypt",
    taxId: "123456789",
  },
  {
    id: "cust-2",
    name: "Nile Retail Group",
    email: "sales@nileretail.eg",
    phone: "+20 101 987 6543",
    city: "Alexandria",
    country: "Egypt",
    taxId: "987654321",
  },
  {
    id: "cust-3",
    name: "Future Tech Solutions",
    email: "purchasing@futuretech.eg",
    phone: "+20 102 555 8888",
    city: "New Cairo",
    country: "Egypt",
    taxId: "555444333",
  },
];

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    sku: "LAPTOP-001",
    name: "Professional Laptop",
    description: "High-performance laptop for business use",
    unitPrice: 15000, // EGP
    unit: "units",
  },
  {
    id: "prod-2",
    sku: "MOUSE-001",
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse",
    unitPrice: 450, // EGP
    unit: "units",
  },
  {
    id: "prod-3",
    sku: "KEYBOARD-001",
    name: "Mechanical Keyboard",
    description: "RGB Mechanical keyboard",
    unitPrice: 2500, // EGP
    unit: "units",
  },
  {
    id: "prod-4",
    sku: "MONITOR-001",
    name: "4K Monitor",
    description: "27-inch 4K UHD Display",
    unitPrice: 8500, // EGP
    unit: "units",
  },
  {
    id: "prod-5",
    sku: "CABLE-001",
    name: "USB-C Cable",
    description: "Premium 2-meter USB-C cable",
    unitPrice: 250, // EGP
    unit: "units",
  },
];

const SAMPLE_WAREHOUSES: Warehouse[] = [
  {
    id: "wh-1",
    name: "Cairo Central Warehouse",
    location: "Helwan, Cairo",
  },
  {
    id: "wh-2",
    name: "Alexandria Distribution Center",
    location: "Alexandria Port Area",
  },
];

const SAMPLE_PAYMENT_TERMS: PaymentTerm[] = [
  {
    id: "pt-1",
    name: "Net 30",
    daysUntilDue: 30,
  },
  {
    id: "pt-2",
    name: "Net 60",
    daysUntilDue: 60,
  },
  {
    id: "pt-3",
    name: "Net 90",
    daysUntilDue: 90,
  },
  {
    id: "pt-4",
    name: "Due on Receipt",
    daysUntilDue: 0,
  },
];

// ============================================
// INITIAL INVENTORY
// ============================================

const SAMPLE_INVENTORY_STOCK: InventoryStock[] = [
  // Cairo Central Warehouse Stock
  {
    id: "stock-1",
    warehouseId: "wh-1",
    productId: "prod-1",
    availableQuantity: 15,
    reservedQuantity: 0,
  },
  {
    id: "stock-2",
    warehouseId: "wh-1",
    productId: "prod-2",
    availableQuantity: 50,
    reservedQuantity: 0,
  },
  {
    id: "stock-3",
    warehouseId: "wh-1",
    productId: "prod-3",
    availableQuantity: 30,
    reservedQuantity: 0,
  },
  {
    id: "stock-4",
    warehouseId: "wh-1",
    productId: "prod-4",
    availableQuantity: 8,
    reservedQuantity: 0,
  },
  {
    id: "stock-5",
    warehouseId: "wh-1",
    productId: "prod-5",
    availableQuantity: 100,
    reservedQuantity: 0,
  },

  // Alexandria Distribution Center Stock
  {
    id: "stock-6",
    warehouseId: "wh-2",
    productId: "prod-1",
    availableQuantity: 10,
    reservedQuantity: 0,
  },
  {
    id: "stock-7",
    warehouseId: "wh-2",
    productId: "prod-2",
    availableQuantity: 40,
    reservedQuantity: 0,
  },
  {
    id: "stock-8",
    warehouseId: "wh-2",
    productId: "prod-3",
    availableQuantity: 25,
    reservedQuantity: 0,
  },
];

// ============================================
// SAMPLE USERS
// ============================================

export const SAMPLE_USERS: Record<UserRole, User> = {
  SALES_USER: {
    id: "user-sales",
    name: "Fatima Sales Rep",
    role: "SALES_USER",
  },
  SALES_MANAGER: {
    id: "user-manager",
    name: "Hassan Sales Manager",
    role: "SALES_MANAGER",
  },
  WAREHOUSE_USER: {
    id: "user-warehouse",
    name: "Omar Warehouse Staff",
    role: "WAREHOUSE_USER",
  },
  FINANCE_USER: {
    id: "user-finance",
    name: "Layla Finance Officer",
    role: "FINANCE_USER",
  },
};

// ============================================
// EXPORT: CREATE INITIAL STATE
// ============================================

export function createInitialAppState(userRole: UserRole): AppState {
  return {
    currentUser: SAMPLE_USERS[userRole],
    catalog: {
      customers: SAMPLE_CUSTOMERS,
      products: SAMPLE_PRODUCTS,
      warehouses: SAMPLE_WAREHOUSES,
      paymentTerms: SAMPLE_PAYMENT_TERMS,
    },
    sales: {
      orders: [],
    },
    inventory: {
      stock: SAMPLE_INVENTORY_STOCK,
    },
    finance: {
      invoices: [],
    },
    auditTrail: [],
  };
}

/**
 * Load state from localStorage or return initial state
 */
export function loadAppState(userRole: UserRole): AppState {
  try {
    const stored = localStorage.getItem("miniflow-erp-state");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Preserve user role from current selection
      return {
        ...parsed,
        currentUser: SAMPLE_USERS[userRole],
      };
    }
  } catch (e) {
    console.error("Failed to load state from localStorage", e);
  }
  return createInitialAppState(userRole);
}

/**
 * Save state to localStorage
 */
export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem("miniflow-erp-state", JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state to localStorage", e);
  }
}

/**
 * Reset to initial state and clear localStorage
 */
export function resetAppState(userRole: UserRole): AppState {
  localStorage.removeItem("miniflow-erp-state");
  return createInitialAppState(userRole);
}
