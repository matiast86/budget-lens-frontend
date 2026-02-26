import { apiFetch } from "./api-client";
import type { DebtOwnerResponseDto } from "../types";

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
 * Try to create a debt owner by name. If it already exists (unique constraint),
 * fall back to fetching the existing one by name.
 */
export const findOrCreateDebtOwner = async (
  ledgerId: string,
  name: string,
  token: string,
): Promise<DebtOwnerResponseDto> => {
  try {
    return await createDebtOwner(ledgerId, name.trim(), token);
  } catch {
    return await getDebtOwnerByName(ledgerId, name.trim(), token);
  }
};
