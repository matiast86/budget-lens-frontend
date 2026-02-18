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
