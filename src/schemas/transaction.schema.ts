import { z } from "zod";

export const createTransactionSchema = z.object({
  entryType: z.enum(["INCOME", "EXPENSE"]),

  status: z.enum(["CURRENT", "FUTURE", "CLOSED"]),

  transactionDate: z.string().min(1, "transaction.create.error.dateRequired"),

  paymentMonth: z.string().min(1, "transaction.create.error.paymentMonthRequired"),

  currency: z.enum(["ARS", "USD"]),

  totalAmount: z
    .number({ invalid_type_error: "transaction.create.error.amountPositive" })
    .positive("transaction.create.error.amountPositive"),

  installments: z
    .number({ invalid_type_error: "transaction.create.error.installmentsMin" })
    .int()
    .min(1, "transaction.create.error.installmentsMin"),

  isPaid: z.boolean(),

  impactsCashflow: z.boolean(),

  categoryId: z.coerce
    .number({ invalid_type_error: "transaction.create.error.categoryRequired" })
    .positive("transaction.create.error.categoryRequired"),

  groupId: z.preprocess(
    (val) => (val === "" || val === "0" || val === 0 ? undefined : Number(val)),
    z.number().positive().optional(),
  ),

  paymentMethodId: z.coerce
    .number({ invalid_type_error: "transaction.create.error.paymentMethodRequired" })
    .positive("transaction.create.error.paymentMethodRequired"),

  comment: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().max(500, "transaction.create.error.commentTooLong").optional(),
  ),
});

export type CreateTransactionFormData = z.infer<typeof createTransactionSchema>;
