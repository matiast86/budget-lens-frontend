import { z } from "zod";

export const createLedgerSchema = z.object({
  name: z
    .string()
    .min(1, "create.error.nameRequired")
    .max(100, "create.error.nameTooLong"),

  description: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().max(300, "create.error.descriptionTooLong").optional(),
  ),

  currency: z.enum(["ARS", "USD"]),

  baseCpiIndex: z.preprocess(
    (val) =>
      val === "" || val === undefined || (typeof val === "number" && isNaN(val as number))
        ? undefined
        : Number(val),
    z.number().positive("create.error.baseCpiPositive").optional(),
  ),
});

export type CreateLedgerFormData = z.infer<typeof createLedgerSchema>;
