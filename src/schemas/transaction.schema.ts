import { z } from "zod";

// Empty inputs from RHF arrive as "" or NaN (when valueAsNumber is set).
// Normalise those to undefined so `.optional()` fields stay optional.
const optionalNumber = (schema: z.ZodType<number | undefined>) =>
  z.preprocess(
    (v) =>
      v === "" || v === null || v === undefined || (typeof v === "number" && Number.isNaN(v))
        ? undefined
        : v,
    schema,
  );

export const createTransactionSchema = z
  .object({
  entryType: z.enum(["INCOME", "EXPENSE"]),

  // VARIABLE = single one-off transaction.
  // FIXED = recurring "bundle": one transaction per month from `paymentMonth`
  // through `bundleTo` (both inclusive), optionally compounding by `increaseRate`.
  transactionType: z.enum(["VARIABLE", "FIXED"]).default("VARIABLE"),

  transactionDate: z.string().min(1, "transaction.create.error.dateRequired"),

  paymentMonth: z.string().min(1, "transaction.create.error.paymentMonthRequired"),

  currency: z.enum(["ARS", "USD"]),

  totalAmount: z
    .number({ error: "transaction.create.error.amountPositive" })
    .positive("transaction.create.error.amountPositive"),

  installments: z
    .number({ error: "transaction.create.error.installmentsMin" })
    .int()
    .min(1, "transaction.create.error.installmentsMin"),

  isPaid: z.boolean(),

  impactsCashflow: z.boolean(),

  categoryId: z.coerce
    .number({ error: "transaction.create.error.categoryRequired" })
    .positive("transaction.create.error.categoryRequired"),

  groupId: z.coerce
    .number({ error: "transaction.create.error.groupRequired" })
    .positive("transaction.create.error.groupRequired"),

  paymentMethodId: z.coerce
    .number({ error: "transaction.create.error.paymentMethodRequired" })
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
          .number({ error: "transaction.create.error.debtAmountPositive" })
          .positive("transaction.create.error.debtAmountPositive"),
        direction: z.enum(["OWED_TO_ME", "OWED_BY_ME"]),
      }),
    )
    .default([]),

  // --- Recurring "bundle" params — only used when transactionType === "FIXED" ---

  // End period (inclusive) for the recurring bundle, as "YYYY-MM".
  bundleTo: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.string().optional(),
  ),

  // Percentage increase applied every `increaseEveryMonths` (e.g. 10 = +10%).
  // Converted to a fraction before hitting the API.
  increaseRate: optionalNumber(
    z
      .number({ error: "transaction.create.error.increaseRateInvalid" })
      .min(0, "transaction.create.error.increaseRateInvalid")
      .optional(),
  ),

  increaseEveryMonths: optionalNumber(
    z
      .number({ error: "transaction.create.error.increaseEveryMonthsInvalid" })
      .int("transaction.create.error.increaseEveryMonthsInvalid")
      .min(1, "transaction.create.error.increaseEveryMonthsInvalid")
      .optional(),
  ),
  })
  .superRefine((data, ctx) => {
    if (data.transactionType !== "FIXED") return;
    if (!data.bundleTo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["bundleTo"],
        message: "transaction.create.error.bundleToRequired",
      });
      return;
    }
    // Both values come from <input type="month"> ("YYYY-MM"), so lexical
    // comparison is chronological. The bundle must span at least one month.
    if (data.paymentMonth && data.bundleTo <= data.paymentMonth) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["bundleTo"],
        message: "transaction.create.error.bundleToAfter",
      });
    }
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
    .number({ error: "transaction.edit.error.amountPositive" })
    .positive("transaction.edit.error.amountPositive"),

  transactionDate: z.string().min(1, "transaction.edit.error.dateRequired"),

  paymentMonth: z.string().min(1, "transaction.edit.error.paymentMonthRequired"),

  categoryId: z.coerce
    .number({ error: "transaction.edit.error.categoryRequired" })
    .positive("transaction.edit.error.categoryRequired"),

  groupId: z.coerce
    .number({ error: "transaction.edit.error.groupRequired" })
    .positive("transaction.edit.error.groupRequired"),

  paymentMethodId: z.coerce
    .number({ error: "transaction.edit.error.paymentMethodRequired" })
    .positive("transaction.edit.error.paymentMethodRequired"),
});

export type EditTransactionFormData = z.infer<typeof editTransactionSchema>;
