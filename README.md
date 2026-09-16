MiniFlow ERP -  Project

A small, educational ERP system built with React + TypeScript that demonstrates real ERP architecture principles, workflow management, and cross-domain communication.



This project teaches these fundamental ERP concepts:

1. **Business Domains** - Sales, Inventory, Finance, and Catalogs operate independently but exchange data
2. **Catalog vs. Transactional Data** - Master data vs. operational records
3. **Workflow States and Actions** - How systems control document lifecycle
4. **Data-Driven Architecture** - Configuration-based rules vs. hard-coded logic
5. **Role-Based Permissions** - Different users have different allowed actions
6. **Audit Trail** - Complete history of every change
7. **Domain Interactions** - How one action triggers effects in other domains
8. **State Machines** - Validated transitions between statuses



# Installation

```bash
cd mini-erp
npm install
npm run dev
```

Open `http://localhost:5173`

### Build

```bash
npm run build      # Compile for production
npm run preview    # Preview production build
npm run lint       # Check for errors
```

## THE DATA-DRIVEN WORKFLOW (Core Learning)

### Problem: Hard-Coded Workflow

Most apps hard-code state transitions like this:

```typescript
 - Every new status requires code changes
function renderActions(order, role) {
  if (order.status === "DRAFT" && role === "SALES_USER") {
    return <button>Submit</button>;
  }
  if (order.status === "PENDING_APPROVAL" && role === "SALES_MANAGER") {
    return <button>Approve</button>;
  }
  if (order.status === "PENDING_APPROVAL" && role === "SALES_MANAGER") {
    return <button>Reject</button>;
  }
  // ... 20+ more conditions
}
```

Problems:

- Adding a new status requires code changes + deployment
- UI logic is scattered across components
- Business logic mixed with presentation
- Difficult to change rules without recompiling

### Solution: Configuration-Driven Design

We define workflow as data:

```typescript
//Good - src/config/salesOrderWorkflow.ts
const SALES_ORDER_WORKFLOW: WorkflowTransition[] = [
  {
    fromStatus: "DRAFT",
    action: "SUBMIT",
    allowedRoles: ["SALES_USER"],
    toStatus: "PENDING_APPROVAL",
    label: "Submit for Approval",
    variant: "primary",
  },
  {
    fromStatus: "PENDING_APPROVAL",
    action: "APPROVE",
    allowedRoles: ["SALES_MANAGER"],
    toStatus: "CONFIRMED",
    label: "Approve Order",
    variant: "success",
  },
  // ... more transitions
];
```

The generic UI reads from this configuration:

```typescript
// src/components/ActionBar.tsx - NEVER CHANGES
export function ActionBar({ order, userRole, onAction }) {
  const allowedActions = getAvailableActions(order.status, userRole);

  return (
    <div>
      {allowedActions.map(action => (
        <button key={action.action} onClick={() => onAction(action.action)}>
          {action.label}
        </button>
      ))}
    </div>
  );
}
```

**To add a new status:** Just edit the config. UI automatically works.

**Advantages:**

- Single source of truth for workflow
- Business users can read (and eventually edit) configuration
- UI never needs to change
- Scalable to hundreds of statuses
- Easy to test

## Complete Test Scenario

Follow these steps to verify the architecture:

### Step 1: Create Order (SALES_USER)

1. Use the role dropdown → Select "SALES_USER: Fatima Sales Rep"
2. Go to **Sales** tab
3. Click **Create New Order**
4. Status is **DRAFT**
5. Check **Audit Timeline** → See "Created" entry

### Step 2: Submit for Approval (SALES_USER)

1. Order still selected
2. Click **Submit for Approval** button
   - (Button appears because config says SALES_USER can submit from DRAFT)
3. Status changes to **PENDING_APPROVAL**
4. Check **Audit Timeline** → See new entry showing DRAFT → PENDING_APPROVAL

### Step 3: Approve (SALES_MANAGER)

1. Use role dropdown → Select "SALES_MANAGER: Hassan Sales Manager"
2. Order still shows (buttons changed)
3. Click **Approve Order**
   - (Button appears because config says SALES_MANAGER can approve)
4. Status changes to **CONFIRMED**
5. Check **Audit Timeline** → New entry by SALES_MANAGER

### Step 4: Reserve Stock (WAREHOUSE_USER)

1. Use role dropdown → Select "WAREHOUSE_USER: Omar Warehouse Staff"
2. Order still shows (new buttons available)
3. Click **Reserve Stock**
4. Status changes to **READY_TO_SHIP**
5. Go to **Inventory** tab
   - See "Available" decreased, "Reserved" increased
   - This confirms cross-domain communication works
6. Back to **Sales**, check **Audit Timeline** → New entry by WAREHOUSE_USER

### Step 5: Ship (WAREHOUSE_USER)

1. Still as WAREHOUSE_USER
2. Click **Mark as Shipped**
3. Status changes to **SHIPPED**
4. Go to **Finance** tab
   - New invoice was auto-created
   - Invoice has same items and total as order
   - Due date calculated from payment terms
5. Check **Audit Timeline** → New entry showing READY_TO_SHIP → SHIPPED

### What You Just Demonstrated

- Workflow state machine (DRAFT → ... → SHIPPED)
- Role-based actions (different users, different buttons)
- Configuration-driven UI (ActionBar never hard-coded)
- Cross-domain effects (inventory updated, invoice created)
- Audit trail (complete history)
- Data persistence (refresh page, data stays via localStorage)

## Project Structure

```
src/
├── types/
│   └── erp.ts                   # Data model: Customer, Product, SalesOrder, etc.
├── config/
│   └── salesOrderWorkflow.ts    # Configuration: Statuses, actions, transitions
├── services/
│   └── workflowEngine.ts        # Business logic: Reservation, invoicing
├── data/
│   └── initialData.ts           # Sample data + localStorage helpers
├── components/
│   ├── AppLayout.tsx            # Header, sidebar structure
│   ├── StatusBadge.tsx          # Status display
│   ├── ActionBar.tsx            # GENERIC component (reads config)
│   └── AuditTimeline.tsx        # History visualization
├── features/
│   ├── Dashboard.tsx            # Overview
│   ├── sales/SalesPage.tsx      # Order management
│   ├── inventory/InventoryPage.tsx
│   ├── finance/FinancePage.tsx
│   └── catalogs/CatalogsPage.tsx
└── styles/                      # CSS files
```

## Key Files to Study

### 1. Type Definitions (`src/types/erp.ts`)

Start here to understand the data model:

```typescript
// Master data (static)
Customer { id, name, email, ... }
Product { id, sku, name, unitPrice, ... }
Warehouse { id, name, location }
PaymentTerm { id, name, daysUntilDue }

// Transactional data (changes frequently)
SalesOrder { id, customerId, status, items[], totalAmount }
SalesOrderItem { productId, quantity, unitPrice, lineTotal }

// Operational data
InventoryStock { warehouseId, productId, availableQuantity, reservedQuantity }

// Financial data
Invoice { salesOrderId, customerId, items[], totalAmount }

// Workflow
SalesOrderStatus = "DRAFT" | "PENDING_APPROVAL" | "CONFIRMED" | ...
SalesOrderAction = "SUBMIT" | "APPROVE" | "RESERVE_STOCK" | ...
UserRole = "SALES_USER" | "SALES_MANAGER" | "WAREHOUSE_USER" | ...

// Audit
AuditEntry { timestamp, action, previousStatus, newStatus, performedByRole }
```

**Learning**: Everything is typed. This is the contract between domains.

### 2. Workflow Configuration (`src/config/salesOrderWorkflow.ts`)

This is the single source of truth:

```typescript
{
  fromStatus: "DRAFT",
  action: "SUBMIT",
  allowedRoles: ["SALES_USER"],
  toStatus: "PENDING_APPROVAL",
  label: "Submit for Approval",
  variant: "primary",
}
```

**Key functions:**

- `getAvailableActions(status, role)` → Returns actions user can do
- `validateAndGetNextStatus(status, action, role)` → Validates transition

**Learning**: Configuration-driven means this one file controls all workflow behavior.

### 3. Workflow Engine (`src/services/workflowEngine.ts`)

Implements the business logic:

```typescript
function executeWorkflowAction(state, orderId, action) {
  // 1. Validate (uses configuration)
  const nextStatus = validateAndGetNextStatus(...);

  // 2. Execute side effects
  if (action === "RESERVE_STOCK") {
    reserveStockForOrder(...); // Business logic stays in code
  }
  if (action === "SHIP") {
    createInvoiceForOrder(...); // Cross-domain effect
  }

  // 3. Record audit
  createAuditEntry(...);

  // 4. Return new state
  return updatedState;
}
```

**Learning**: Why side effects stay in code:

- Complex validation (insufficient stock)
- Multi-step operations (update multiple inventory records)
- Error handling and recovery
- Integration with other systems

A real backend would still code this; configuration is only for state transitions.

### 4. Generic ActionBar (`src/components/ActionBar.tsx`)

The most important UI component:

```typescript
export function ActionBar({ order, userRole, onAction }) {
  // This is the magic:
  const allowedActions = getAvailableActions(order.status, userRole);

  // Render from config - no hard-coding
  return (
    <div>
      {allowedActions.map(transition => (
        <button
          key={transition.action}
          onClick={() => onAction(transition.action)}
        >
          {transition.label}
        </button>
      ))}
    </div>
  );
}
```

**Learning**: This component never changes. It works with any workflow configuration because it's completely generic.

### 5. Sales Page (`src/features/sales/SalesPage.tsx`)

Demonstrates domain usage:

```typescript
const handleAction = (action) => {
  // Execute workflow action (may affect multiple domains)
  const { state: updatedState, result } = executeWorkflowAction(
    state,
    orderId,
    action,
  );

  if (result.success) {
    // Update UI
    onStateChange(updatedState);
    // Persist
    saveAppState(updatedState);
  } else {
    // Show error
    setError(result.error);
  }
};
```

**Learning**: Single place where workflow is executed. All side effects handled by engine.

## Hard-Coded vs. Data-Driven Comparison

### Hard-Coded (What to Avoid)

```typescript
function canUserApproveOrder(order, role) {
  return order.status === "PENDING_APPROVAL" && role === "SALES_MANAGER";
}

function canUserReserveStock(order, role) {
  return order.status === "CONFIRMED" && role === "WAREHOUSE_USER";
}

function getNextStatusAfterApproval() {
  return "CONFIRMED";
}

function renderOrderActions(order, role) {
  const actions = [];

  if (order.status === "DRAFT" && role === "SALES_USER") {
    actions.push({ label: "Submit", onClick: () => ... });
  }
  if (order.status === "PENDING_APPROVAL" && role === "SALES_MANAGER") {
    actions.push({ label: "Approve", onClick: () => ... });
  }
  // ... 20 more conditions

  return actions;
}
```

Problems:

- Every new status requires code changes
- Business logic scattered across files
- Difficult to change rules
- Hard to test

###Data-Driven (MiniFlow Approach)

```typescript
// Step 1: Define in configuration
const SALES_ORDER_WORKFLOW = [
  { fromStatus: "DRAFT", action: "SUBMIT", allowedRoles: ["SALES_USER"], toStatus: "PENDING_APPROVAL" },
  { fromStatus: "PENDING_APPROVAL", action: "APPROVE", allowedRoles: ["SALES_MANAGER"], toStatus: "CONFIRMED" },
  // ...
];

// Step 2: Query configuration
function getAvailableActions(status, role) {
  return SALES_ORDER_WORKFLOW.filter(
    t => t.fromStatus === status && t.allowedRoles.includes(role)
  );
}

// Step 3: Render generically
function ActionBar({ order, role, onAction }) {
  const actions = getAvailableActions(order.status, role);
  return <div>{actions.map(a => <button>{a.label}</button>)}</div>;
}
```

Advantages:

- Add new status only to config
- UI never changes
- Central control
- Easy to test configuration
- Scalable

## Testing Scenarios

### Valid Workflow

```
SALES_USER creates → DRAFT
SALES_USER submits → PENDING_APPROVAL
SALES_MANAGER approves → CONFIRMED
WAREHOUSE_USER reserves → READY_TO_SHIP
WAREHOUSE_USER ships → SHIPPED (invoice auto-created)
```

Result: All audit entries, inventory updated, invoice exists.

### Permission Denied

Create as SALES_USER. Switch to WAREHOUSE_USER. Notice:

- No "Submit" button (only SALES_USER can submit)
- Only "Reserve Stock" and "Mark Shipped" appear (but both disabled until order reaches correct status)

###Business Rule Violation

Try to reserve stock when insufficient quantity:

- Order for 100 units
- Inventory only has 15
- Action fails with error: "Insufficient stock"

### Persistence

Create order. Refresh page. Order still exists (localStorage).

### Reset

Click "Reset Data" button. Returns to initial state with sample data.

## Five Questions You Should Answer

After studying this project:

### 1. "What's the difference between status and action?"

**Answer**:

- **Status** = current state of the order (DRAFT, CONFIRMED, SHIPPED)
- **Action** = something a user does to change status (SUBMIT, APPROVE, RESERVE_STOCK)

The configuration maps actions to status transitions.

### 2. "Why is workflow in configuration, not code?"

**Answer**:

- Business rules change frequently without code review
- Adding a status shouldn't require deployment
- Configuration is single source of truth
- UI can be generic (never changes)
- Non-developers can eventually read/edit configuration

### 3. "Why do side effects stay in code?"

**Answer**:

- Reservation logic is complex (check each item, validate quantities)
- Invoice creation requires calculation (dates, amounts)
- Need error handling (what if reservation fails?)
- Validation rules are business logic, not just state

Configuration is for state machines; complexity stays in code.

### 4. "How does ActionBar work without hard-coding?"

**Answer**:

- It calls `getAvailableActions(status, role)`
- This queries the configuration
- It renders buttons from whatever the configuration returns
- Add 10 new statuses? ActionBar doesn't change.

This is the opposite of hard-coded if/else chains.

### 5. "How do domains interact?"

**Answer**:

- All domains share AppState
- When order ships (Sales domain):
  - Workflow engine creates invoice (Finance domain)
  - Workflow engine updates inventory (Inventory domain)
  - Audit entry created
- Single transaction, multiple domain effects
- No domain modifies another directly; only through workflow engine

## Data Model

| Layer         | Entity         | Purpose                          |
| ------------- | -------------- | -------------------------------- |
| **Catalog**   | Customer       | Master data - customer info      |
| **Catalog**   | Product        | Master data - product info       |
| **Catalog**   | Warehouse      | Master data - location           |
| **Catalog**   | PaymentTerm    | Master data - payment rules      |
| **Sales**     | SalesOrder     | Transactional - customer order   |
| **Sales**     | SalesOrderItem | Transactional - order line items |
| **Inventory** | InventoryStock | Operational - quantity tracking  |
| **Finance**   | Invoice        | Financial - billing document     |
| **Workflow**  | AuditEntry     | Historical - complete change log |

## How This Relates to Real Job Interviews

### Interview Q1: "How would you design an order workflow?"

**Your answer (using MiniFlow):**

"I'd separate configuration from logic. First, define statuses, actions, and roles in configuration—this is the single source of truth. Then, build a workflow engine that validates transitions and executes side effects like inventory updates. UI components would be generic—they query the configuration and render dynamically. This means adding a new status requires only configuration changes, not code or UI updates."

### Interview Q2: "How do you handle complex state management?"

**Your answer:**

"I'd use a centralized AppState containing all domains. When an action succeeds, the workflow engine updates multiple domains in one transaction. For the frontend, I'd track this in React state (or Redux if larger), and persist to localStorage for recovery. In production, I'd move the workflow engine to the backend and have it return `{ newState, auditEntry, errors }`."

### Interview Q3: "How do you prevent invalid operations?"

**Your answer:**

"Configuration validates which statuses/roles can do each action. The workflow engine double-checks before execution. Business rules like 'insufficient stock' are validation functions in the engine. If validation fails, we return an error and don't change state. The audit trail records what was attempted and why it failed."

### Interview Q4: "How would you scale this?"

**Your answer:**

"For more workflows (HR, Purchasing), I'd generalize the engine. For more data, I'd add backend API and database. For cross-service communication, I'd use events (order.shipped event → Finance service creates invoice). For high throughput, add caching and async processing. The configuration-driven approach makes these changes easier because business logic is centralized."

## UI/UX Notes

- **Professional look**: Intentionally boring business software style
- **Sidebar navigation**: Standard ERP layout
- **Status colors**: Visual understanding of workflow state
- **Role dropdown**: Easy testing of permissions
- **Reset button**: Restore demo data
- **Responsive grid**: Works on smaller screens
- **Clear error messages**: Help users understand failures

## Study Guide

**Day 1: Understand the types**

- Read `src/types/erp.ts`
- Understand Customer → SalesOrder → Invoice relationships
- Note: SalesOrder references customerId, not Customer object

**Day 2: Study configuration**

- Read `src/config/salesOrderWorkflow.ts`
- Understand each transition
- Try adding a new status mentally: what would change?

**Day 3: Learn the engine**

- Read `src/services/workflowEngine.ts`
- Understand `executeWorkflowAction()` flow
- See where stock reservation and invoicing happen

**Day 4: Build the UI**

- Read `src/components/ActionBar.tsx`
- See how it reads from config
- Read `src/features/sales/SalesPage.tsx`
- Understand state management

**Day 5: Test everything**

- Run through complete scenario
- Try invalid operations
- Check localStorage persistence
- Test role switching

## Learning Resources

- **State Machines**: Xstate documentation
- **Workflow Engines**: Temporal, Airflow
- **ERP Concepts**: SAP/Oracle documentation
- **Event-Driven**: Event sourcing patterns
- **React Patterns**: Custom hooks, Context API

## Next Steps

- [ ] Run complete scenario from readme
- [ ] Add a new workflow status (e.g., "ON_HOLD")
- [ ] Implement order rejection
- [ ] Add payment status to invoices
- [ ] Create a Sales by Customer report
- [ ] Add product search/filter
- [ ] Implement order item editing

---

**Master the architecture in this project and you'll understand 80% of real ERP systems.** 🚀

      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },

},
])

````

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

````
