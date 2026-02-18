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
