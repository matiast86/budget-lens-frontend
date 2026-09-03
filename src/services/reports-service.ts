import type { CashflowReportDto, DebtReportDto } from "../types";
import { apiFetch } from "./api-client";

export const getCashflow = (
  ledgerId: number,
  from: string,
  to: string,
  token: string,
): Promise<CashflowReportDto> =>
  apiFetch<CashflowReportDto>(
    `/reports/ledgers/${ledgerId}/cashflow?from=${from}&to=${to}`,
    {},
    token,
  );

export const getDebtReport = (
  ledgerId: number,
  from: string,
  to: string,
  token: string,
): Promise<DebtReportDto> =>
  apiFetch<DebtReportDto>(
    `/reports/ledgers/${ledgerId}/debts?from=${from}&to=${to}`,
    {},
    token,
  );
