// ---------------------------------------------------------------------------
// Backend DTOs — nested / shared
// ---------------------------------------------------------------------------

import type { CreditBrand, Currency, DebtDirection, EntryType, Gender, PaymentType, Role, Status } from "./prisma-enums";

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

export interface DebtOwnerResponseDto {
  id: number;
  name: string;
  ledgerId: number;
  /** Present on GET /debt-owners/ledgers/:id — the owner's debt assignments. */
  transactions?: TransactionDebtOwnerResponseDto[];
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

/** Returned by GET /users/:id */
export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  birthDate: string;
  gender: Gender;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Returned by POST /auth/signin — includes ledger list */
export interface UserDashboardViewDto extends UserResponseDto {
  ledgers: LedgerDashboardResponseDto[];
}

// ---------------------------------------------------------------------------
// Cashflow report DTOs — mirrors backend reports module
// ---------------------------------------------------------------------------

export interface CashflowPeriodAmountDto {
  period: string;
  planned: number;
  balance: number;
}

export interface CashflowGroupDto {
  id: number;
  name: string;
  amounts: CashflowPeriodAmountDto[];
}

export interface CashflowCategoryDto {
  id: number;
  name: string;
  total: CashflowPeriodAmountDto[];
  groups: CashflowGroupDto[];
}

export interface CashflowPaymentMethodDto {
  id: number;
  name: string;
  total: CashflowPeriodAmountDto[];
  categories: CashflowCategoryDto[];
}

export interface CashflowEntryTypeDto {
  total: CashflowPeriodAmountDto[];
  paymentMethods: CashflowPaymentMethodDto[];
}

export interface CashflowMetaDto {
  periods: string[];
  currentWeek: number;
  currency: Currency;
  from: string;
  to: string;
}

export interface CashflowReportDto {
  meta: CashflowMetaDto;
  income: CashflowEntryTypeDto;
  expense: CashflowEntryTypeDto;
  grandTotal: CashflowPeriodAmountDto[];
}

// ---------------------------------------------------------------------------
// Debt report DTOs — mirrors backend reports module (GET /reports/.../debts)
// ---------------------------------------------------------------------------

export interface DebtPeriodAmountDto {
  period: string;
  /** Net signed amount: positive = owed to me, negative = owed by me. */
  amount: number;
}

export interface DebtDetailDto {
  description: string;
  amounts: DebtPeriodAmountDto[];
}

export interface DebtOwnerReportDto {
  id: number;
  name: string;
  total: DebtPeriodAmountDto[];
  debts: DebtDetailDto[];
}

export interface DebtReportMetaDto {
  periods: string[];
  from: string;
  to: string;
  currency: Currency;
}

export interface DebtReportDto {
  meta: DebtReportMetaDto;
  owners: DebtOwnerReportDto[];
  grandTotal: DebtPeriodAmountDto[];
}
