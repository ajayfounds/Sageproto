# Empty State Implementation Guide

This document shows how to wire the reusable `EmptyState` component across the app.

## EmptyState Component

Location: `/src/app/components/EmptyState.tsx`

Props:
- `icon: IconKey` - The outline icon to display
- `title: string` - H3 heading
- `subtitle: string` - Supportive 16px body text
- `actionLabel?: string` - Optional primary button label
- `onAction?: () => void` - Optional primary button action

## Implemented Empty States

### 1. Notifications (✅ Implemented)
```tsx
<EmptyState
  icon="bell"
  title="You're all caught up"
  subtitle="New alerts about your money and security will show up here."
/>
```

## Recommended Empty States

### 2. Activity/Transactions Empty
```tsx
<EmptyState
  icon="receipt"
  title="No transactions yet"
  subtitle="Your activity will appear here once you send or receive money."
  actionLabel="Send money"
  onAction={() => navigate("sendMoney")}
/>
```

### 3. Accounts Empty
```tsx
<EmptyState
  icon="accounts"
  title="No accounts linked"
  subtitle="Add a bank account or wallet to get started."
  actionLabel="Add account"
  onAction={() => toast("Add account feature")}
/>
```

### 4. Budgets Empty
```tsx
<EmptyState
  icon="chart"
  title="No budgets set"
  subtitle="Create a budget to track your spending by category."
  actionLabel="Create budget"
  onAction={() => toast("Create budget feature")}
/>
```

## SuccessScreen Component (✅ Already Reusable)

Location: `/src/app/components/SuccessScreen.tsx`

Props:
- `title: string` - H1 heading (e.g., "Transfer complete", "Payee added")
- `subtitle?: string` - Optional descriptive text
- `amount?: number` - Optional money amount to display
- `referenceId?: string` - Optional copyable reference ID
- `onDone: () => void` - Primary "Done" button action
- `onSecondary?: () => void` - Optional secondary button action
- `secondaryLabel?: string` - Label for secondary button (default: "View receipt")

### Example Usage Beyond Transfers

```tsx
// Payee added
<SuccessScreen
  title="Payee added"
  subtitle="Priya Sharma is now in your saved payees"
  onDone={() => navigate("home")}
/>

// Budget saved
<SuccessScreen
  title="Budget saved"
  subtitle="Your Food & Dining budget is now ₹10,000/month"
  amount={10000}
  onDone={() => navigate("budgets")}
  onSecondary={() => navigate("budgets")}
  secondaryLabel="View budgets"
/>

// Goal created
<SuccessScreen
  title="Goal created"
  subtitle="Goa Trip · Target ₹50,000 by July 2025"
  amount={50000}
  onDone={() => navigate("goals")}
/>
```

## Design Principles

- **Calm & Encouraging**: Empty is an opportunity, not an error
- **Clear Guidance**: Explain what will appear here once the user takes action
- **Optional Action**: Not every empty state needs a button (e.g., notifications)
- **Consistent Icon Treatment**: Soft teal circle with outline icon
- **Readable Copy**: 16px body for subtitle, never blunt or technical
