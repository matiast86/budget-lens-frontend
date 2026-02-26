import { apiFetch } from "./api-client";
import type { LedgerDashboardResponseDto, LedgerResponseDto } from "../types";
import type { CreateLedgerFormData } from "../schemas/ledger.schema";

export const getLedgers = (token: string): Promise<LedgerDashboardResponseDto[]> =>
  apiFetch<LedgerDashboardResponseDto[]>("/ledgers", {}, token);

export const getLedger = (id: string, token: string): Promise<LedgerResponseDto> =>
  apiFetch<LedgerResponseDto>(`/ledgers/${id}`, {}, token);

export const createLedger = (
  data: CreateLedgerFormData,
  token: string,
): Promise<LedgerDashboardResponseDto> =>
  apiFetch<LedgerDashboardResponseDto>(
    "/ledgers",
    {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        currency: data.currency,
        ...(data.description ? { description: data.description } : {}),
      }),
    },
    token,
  );
