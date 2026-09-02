// ---------------------------------------------------------------------------
// UI-only types (not from backend)
// ---------------------------------------------------------------------------

import type React from "react";

export interface NavItem {
  icon: React.ElementType;
  label: string;
  to: string;
}

export interface StatCardData {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

/** @deprecated UI placeholder — replace with TransactionResponseDto once API is wired */
export interface Transaction {
  name: string;
  category: string;
  amount: string;
  type: "income" | "expense";
}

export interface BudgetItem {
  category: string;
  spent: number;
  budget: number;
  color: string;
  /** Day of the month for the period being shown (1–31). Feeds the pace-based
   *  ● ■ ▲ signal. Defaults to today when omitted. */
  dayOfMonth?: number;
  /** Total days in that month (28–31). Defaults to the current month. */
  daysInMonth?: number;
}

export type LedgerDetailTab =
  | "transactions"
  | "categories"
  | "paymentMethods"
  | "groups"
  | "collaborators";

export interface BottomTabItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

export interface TransactionFilters {
  status?: "CLOSED" | "CURRENT" | "FUTURE";
  entryType?: "INCOME" | "EXPENSE";
  categoryId?: number;
  groupId?: number;
  paymentMethodId?: number;
  /** YYYY-MM format */
  paymentMonth?: string;
  isPaid?: boolean;
  skip?: number;
  take?: number;
}
