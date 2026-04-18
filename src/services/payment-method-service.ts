import { apiFetch } from "./api-client";
import type { PaymentMethodResponseDto, PaymentType, CreditBrand, Currency } from "../types";

export interface CreatePaymentMethodData {
  name: string;
  type: PaymentType;
  brand?: CreditBrand;
  color?: string;
  icon?: string;
  currency?: Currency;
}

export const createPaymentMethod = (
  data: CreatePaymentMethodData,
  token: string,
): Promise<PaymentMethodResponseDto> =>
  apiFetch<PaymentMethodResponseDto>(
    `/payment-methods`,
    { method: "POST", body: JSON.stringify(data) },
    token,
  );

export const updatePaymentMethod = (
  id: number,
  data: Partial<CreatePaymentMethodData>,
  token: string,
): Promise<PaymentMethodResponseDto> =>
  apiFetch<PaymentMethodResponseDto>(
    `/payment-methods/${id}`,
    { method: "PATCH", body: JSON.stringify(data) },
    token,
  );

export const deletePaymentMethod = (
  id: number,
  token: string,
): Promise<void> =>
  apiFetch<void>(`/payment-methods/${id}`, { method: "DELETE" }, token);

export const assignPaymentMethodToLedger = (
  ledgerId: string,
  paymentMethodId: number,
  token: string,
): Promise<void> =>
  apiFetch<void>(
    `/ledgers/${ledgerId}/payment-methods`,
    { method: "POST", body: JSON.stringify({ paymentMethodId }) },
    token,
  );
