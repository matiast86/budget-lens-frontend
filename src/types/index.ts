import type React from "react";

// ---------------------------------------------------------------------------
// Enums — mirror Prisma enums exactly
// ---------------------------------------------------------------------------

export type Gender = "MALE" | "FEMALE";

export type Role = "USER" | "ADMIN";

export type Currency = "ARS" | "USD";

export type EntryType = "INCOME" | "EXPENSE";

export type Status = "CLOSED" | "CURRENT" | "FUTURE";

export type TransactionType = "FIXED" | "VARIABLE";

export type PaymentType = "CASH" | "BANK" | "WALLET" | "CREDIT_CARD" | "OTHER";

export type CreditBrand = "VISA" | "AMEX" | "MASTER" | "OTHER";

export type DebtDirection = "OWED_TO_ME" | "OWED_BY_ME";

export type CategoryScope = "GLOBAL";

// ---------------------------------------------------------------------------
// Backend DTOs
// ---------------------------------------------------------------------------

export interface LedgerDashboardResponseDto {
  id: number;
  name: string;
  description?: string;
  currency: Currency;
  /** CPI index at ledger creation — base for inflation-adjusted amounts */
  baseCpiIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserDashboardViewDto {
  id: string;
  name: string;
  email: string;
  birthDate: string;
  gender: Gender;
  role: Role;
  createdAt: string;
  updatedAt: string;
  ledgers: LedgerDashboardResponseDto[];
  isActive: boolean;
}

// ---------------------------------------------------------------------------
// UI-only types (not from backend)
// ---------------------------------------------------------------------------

export interface NavItem {
  icon: React.ElementType;
  label: string;
  active: boolean;
}

export interface StatCardData {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

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
