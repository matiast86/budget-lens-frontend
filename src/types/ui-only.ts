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
}

export type LedgerDetailTab =
  | "transactions"
  | "categories"
  | "paymentMethods"
  | "groups"
  | "collaborators";
