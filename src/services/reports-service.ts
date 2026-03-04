import type { CashflowReportDto } from "../types";
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
