import { z } from "zod";

export const createLedgerSchema = z.object({
  name: z
    .string()
    .min(1, "create.error.nameRequired")
    .max(100, "create.error.nameTooLong"),

  description: z.string().max(300, "create.error.descriptionTooLong").optional(),

  currency: z.enum(["ARS", "USD"]),
});

export type CreateLedgerFormData = z.infer<typeof createLedgerSchema>;
