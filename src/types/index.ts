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
// Backend DTOs — nested / shared
// ---------------------------------------------------------------------------

export interface CategoryResponseDto {
  id: number;
  name: string;
  description?: string;
  ledgerId: number;
  templateId?: number;
}

export interface GroupResponseDto {
  id: number;
  name: string;
  ledgerId: number;
  userId: string;
}

export interface PaymentMethodResponseDto {
  id: number;
  name: string;
  type: PaymentType;
  brand?: CreditBrand;
  color?: string;
  icon?: string;
  currency?: Currency;
  isActive: boolean;
  userId: string;
}

export interface CollaborationResponseDto {
  id: number;
  name: string;
  isActive: boolean;
  userId: string;
  ledgerId: number;
}

export interface DebtResponseDto {
  id: number;
  period: string;
  description?: string;
}

export interface TransactionDebtOwnerResponseDto {
  transactionId: number;
  debtOwnerId: number;
  debtOwnerName: string;
  amount: number;
  direction: DebtDirection;
  debt: DebtResponseDto;
}

export interface TransactionBreakDownResponseDto {
  id: number;
  weekNumber: number;
  amount: number;
  transactionId: number;
}

export interface TransactionResponseDto {
  id: number;
  ledgerId: number;
  status: Status;
  entryType: EntryType;
  transactionDate: string;
  paymentMonth: string;
  installments: number;
  installment: number;
  comment?: string;
  currency: Currency;
  exchangeRate?: number;
  totalAmount: number;
  monthlyAmount: number;
  isPaid: boolean;
  impactsCashflow: boolean;
  cpiIndex?: number;
  realMonthlyAmount?: number;
  category: CategoryResponseDto;
  group?: GroupResponseDto;
  paymentMethod: PaymentMethodResponseDto;
  transactionsBreakDown?: TransactionBreakDownResponseDto[];
  debtOwners?: TransactionDebtOwnerResponseDto[];
}

// ---------------------------------------------------------------------------
// Backend DTOs — top-level
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

export interface LedgerResponseDto {
  id: number;
  name: string;
  description?: string;
  currency: Currency;
  baseCpiIndex: number;
  ownerId: string;
  collaborations: CollaborationResponseDto[];
  groups: GroupResponseDto[];
  transactions: TransactionResponseDto[];
  paymentMethods: PaymentMethodResponseDto[];
  categories: CategoryResponseDto[];
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
