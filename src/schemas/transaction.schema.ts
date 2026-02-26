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

  groupId: z.coerce
    .number({ invalid_type_error: "transaction.create.error.groupRequired" })
    .positive("transaction.create.error.groupRequired"),

  paymentMethodId: z.coerce
    .number({ invalid_type_error: "transaction.create.error.paymentMethodRequired" })
    .positive("transaction.create.error.paymentMethodRequired"),

  comment: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().max(500, "transaction.create.error.commentTooLong").optional(),
  ),

  debtAssignments: z
    .array(
      z.object({
        ownerName: z.string().min(1, "transaction.create.error.debtOwnerRequired"),
        amount: z
          .number({ invalid_type_error: "transaction.create.error.debtAmountPositive" })
          .positive("transaction.create.error.debtAmountPositive"),
        direction: z.enum(["OWED_TO_ME", "OWED_BY_ME"]),
      }),
    )
    .default([]),
});

export type CreateTransactionFormData = z.infer<typeof createTransactionSchema>;

// ---------------------------------------------------------------------------
// Edit transaction schema
// ---------------------------------------------------------------------------

export const editTransactionSchema = z.object({
  comment: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().max(500, "transaction.edit.error.commentTooLong").optional(),
  ),

  totalAmount: z
    .number({ invalid_type_error: "transaction.edit.error.amountPositive" })
    .positive("transaction.edit.error.amountPositive"),

  transactionDate: z.string().min(1, "transaction.edit.error.dateRequired"),

  paymentMonth: z.string().min(1, "transaction.edit.error.paymentMonthRequired"),

  categoryId: z.coerce
    .number({ invalid_type_error: "transaction.edit.error.categoryRequired" })
    .positive("transaction.edit.error.categoryRequired"),

  groupId: z.coerce
    .number({ invalid_type_error: "transaction.edit.error.groupRequired" })
    .positive("transaction.edit.error.groupRequired"),

  paymentMethodId: z.coerce
    .number({ invalid_type_error: "transaction.edit.error.paymentMethodRequired" })
    .positive("transaction.edit.error.paymentMethodRequired"),
});

export type EditTransactionFormData = z.infer<typeof editTransactionSchema>;
