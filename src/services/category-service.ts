import { apiFetch } from "./api-client";
import type { CategoryResponseDto } from "../types";

export const createCategory = (
  ledgerId: string,
  data: { name: string; description?: string },
  token: string,
): Promise<CategoryResponseDto> =>
  apiFetch<CategoryResponseDto>(
    `/categories/ledgers/${ledgerId}`,
    { method: "POST", body: JSON.stringify(data) },
    token,
  );

export const updateCategory = (
  id: number,
  data: { name?: string; description?: string },
  token: string,
): Promise<CategoryResponseDto> =>
  apiFetch<CategoryResponseDto>(
    `/categories/${id}`,
    { method: "PATCH", body: JSON.stringify(data) },
    token,
  );

export const deleteCategory = (id: number, token: string): Promise<void> =>
  apiFetch<void>(`/categories/${id}`, { method: "DELETE" }, token);
