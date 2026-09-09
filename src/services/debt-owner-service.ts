import { apiFetch } from "./api-client";
import type { DebtOwnerResponseDto } from "../types";

/**
 * List every debt owner for a ledger, each with its nested debt assignments
 * (`transactions`). Backed by GET /debt-owners/ledgers/:ledgerId.
 */
export const getDebtOwners = (
  ledgerId: string | number,
  token: string,
): Promise<DebtOwnerResponseDto[]> =>
  apiFetch<DebtOwnerResponseDto[]>(
    `/debt-owners/ledgers/${ledgerId}?take=200`,
    {},
    token,
  );

export const getDebtOwnerByName = (
  ledgerId: string,
  name: string,
  token: string,
): Promise<DebtOwnerResponseDto> =>
  apiFetch<DebtOwnerResponseDto>(
    `/debt-owners/ledgers/${ledgerId}/by-name/${encodeURIComponent(name)}`,
    {},
    token,
  );

export const createDebtOwner = (
  ledgerId: string,
  name: string,
  token: string,
): Promise<DebtOwnerResponseDto> =>
  apiFetch<DebtOwnerResponseDto>(
    `/debt-owners/ledgers/${ledgerId}`,
    { method: "POST", body: JSON.stringify({ name }) },
    token,
  );

/**
 * Resolve a debt owner by name, creating it only if it doesn't exist yet.
 *
 * Look up by name FIRST: the common case is a person who already exists, and
 * firing a create that's guaranteed to fail the `(ledgerId, name)` unique
 * constraint logs a stack trace on the backend every single time. The create is
 * still guarded so a concurrent request that wins the race falls back to a read.
 */
export const findOrCreateDebtOwner = async (
  ledgerId: string,
  name: string,
  token: string,
): Promise<DebtOwnerResponseDto> => {
  const trimmed = name.trim();
  try {
    return await getDebtOwnerByName(ledgerId, trimmed, token);
  } catch {
    return await createDebtOwner(ledgerId, trimmed, token).catch(() =>
      getDebtOwnerByName(ledgerId, trimmed, token),
    );
  }
};
