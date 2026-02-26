import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "auth.login.error.emailRequired")
    .email("auth.login.error.emailInvalid"),

  password: z.string().min(1, "auth.login.error.passwordRequired"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "auth.register.error.nameRequired")
      .max(100, "auth.register.error.nameTooLong"),

    email: z
      .string()
      .min(1, "auth.register.error.emailRequired")
      .email("auth.register.error.emailInvalid"),

    birthDate: z
      .string()
      .min(1, "auth.register.error.birthDateRequired")
      .refine((v) => !isNaN(Date.parse(v)), "auth.register.error.birthDateInvalid"),

    password: z
      .string()
      .min(8, "auth.register.error.passwordTooShort")
      .max(100, "auth.register.error.passwordTooLong"),

    confirmPassword: z.string().min(1, "auth.register.error.confirmPasswordRequired"),

    gender: z.enum(["MALE", "FEMALE"], {
      required_error: "auth.register.error.genderRequired",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "auth.register.error.passwordMismatch",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
