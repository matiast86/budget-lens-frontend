import { apiFetch } from "./api-client";
import type { UserResponseDto } from "../types";

/** GET /users/:id — public endpoint, no auth header required */
export const getUser = (id: string): Promise<UserResponseDto> =>
  apiFetch<UserResponseDto>(`/users/${id}`);
