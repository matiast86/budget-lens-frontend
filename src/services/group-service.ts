import { apiFetch } from "./api-client";
import type { GroupResponseDto } from "../types";

export const createGroup = (
  ledgerId: string,
  data: { name: string },
  token: string,
): Promise<GroupResponseDto> =>
  apiFetch<GroupResponseDto>(
    `/groups/ledgers/${ledgerId}`,
    { method: "POST", body: JSON.stringify(data) },
    token,
  );

export const updateGroup = (
  id: number,
  data: { name?: string },
  token: string,
): Promise<GroupResponseDto> =>
  apiFetch<GroupResponseDto>(
    `/groups/${id}`,
    { method: "PATCH", body: JSON.stringify(data) },
    token,
  );

export const deleteGroup = (id: number, token: string): Promise<void> =>
  apiFetch<void>(`/groups/${id}`, { method: "DELETE" }, token);
