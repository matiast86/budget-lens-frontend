import { apiFetch } from "./api-client";
import type { UserDashboardViewDto } from "../types";

export interface SignInResponse {
  token: string;
  user: UserDashboardViewDto;
}

export interface SignUpPayload {
  name: string;
  email: string;
  birthDate: string;
  rawPassword: string;
  repeatPassword: string;
  gender: "MALE" | "FEMALE";
}

export const signIn = (email: string, password: string): Promise<SignInResponse> =>
  apiFetch<SignInResponse>("/auth/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const signUp = (payload: SignUpPayload): Promise<{ message: string }> =>
  apiFetch<{ message: string }>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
