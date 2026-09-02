import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../utils/cn";
import { Button } from "../components/atoms/Button";
import { LanguageSwitcher } from "../components/atoms/LanguageSwitcher";
import { registerSchema, type RegisterFormData } from "../schemas/auth.schema";
import { signUp } from "../services/auth-service";
import { ApiError } from "../services/api-client";

const GENDER_OPTIONS: { value: "MALE" | "FEMALE"; labelKey: string }[] = [
  { value: "MALE",   labelKey: "auth.register.gender.MALE" },
  { value: "FEMALE", labelKey: "auth.register.gender.FEMALE" },
];

const inputClass = (hasError: boolean) =>
  cn(
    "w-full rounded-md border bg-white px-sm py-xs text-sm text-stone-900 placeholder:text-stone-400",
    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
    hasError ? "border-expense-400" : "border-stone-300",
  );

export const RegisterPage = () => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      await signUp({
        name: data.name,
        email: data.email,
        birthDate: new Date(data.birthDate).toISOString(),
        rawPassword: data.password,
        repeatPassword: data.confirmPassword,
        gender: data.gender,
      });
      navigate("/login", { state: { registered: true }, replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message);
      } else {
        setServerError(err instanceof Error ? err.message : String(err));
      }
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-md relative">
      {/* Language switcher — top right corner */}
      <div className="absolute top-md right-md">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-sm">

        {/* Logo + title */}
        <div className="text-center mb-xl">
          <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center mx-auto mb-md shadow-card">
            <span className="text-white text-xl font-bold">BL</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">{t("auth.register.title")}</h1>
          <p className="text-sm text-stone-500 mt-xs">{t("auth.register.subtitle")}</p>
        </div>

        {/* Card */}
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-md">

            {/* Server error banner */}
            {serverError && (
              <div
                className="rounded-lg bg-expense-50 border border-expense-100 px-sm py-xs text-sm text-expense-600"
                role="alert"
                aria-live="assertive"
              >
                {serverError}
              </div>
            )}

            {/* Name */}
            <div className="space-y-xs">
              <label htmlFor="reg-name" className="block text-sm font-medium text-stone-700">
                {t("auth.register.field.name")}
                <span className="text-expense-400 ml-xs" aria-hidden="true">*</span>
              </label>
              <input
                id="reg-name"
                type="text"
                autoComplete="name"
                autoFocus
                placeholder={t("auth.register.field.namePlaceholder")}
                className={inputClass(!!errors.name)}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-expense-400" role="alert">{t(errors.name.message ?? "")}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-xs">
              <label htmlFor="reg-email" className="block text-sm font-medium text-stone-700">
                {t("auth.register.field.email")}
                <span className="text-expense-400 ml-xs" aria-hidden="true">*</span>
              </label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                placeholder={t("auth.register.field.emailPlaceholder")}
                className={inputClass(!!errors.email)}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-expense-400" role="alert">{t(errors.email.message ?? "")}</p>
              )}
            </div>

            {/* Birth date */}
            <div className="space-y-xs">
              <label htmlFor="reg-birthdate" className="block text-sm font-medium text-stone-700">
                {t("auth.register.field.birthDate")}
                <span className="text-expense-400 ml-xs" aria-hidden="true">*</span>
              </label>
              <input
                id="reg-birthdate"
                type="date"
                autoComplete="bday"
                className={inputClass(!!errors.birthDate)}
                {...register("birthDate")}
              />
              {errors.birthDate && (
                <p className="text-xs text-expense-400" role="alert">{t(errors.birthDate.message ?? "")}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-xs">
              <label htmlFor="reg-password" className="block text-sm font-medium text-stone-700">
                {t("auth.register.field.password")}
                <span className="text-expense-400 ml-xs" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder={t("auth.register.field.passwordPlaceholder")}
                  className={cn(inputClass(!!errors.password), "pr-10")}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-xs top-1/2 -translate-y-1/2 p-xs text-stone-400 hover:text-stone-600 transition-colors"
                  aria-label={showPassword ? t("auth.register.field.hidePassword") : t("auth.register.field.showPassword")}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-expense-400" role="alert">{t(errors.password.message ?? "")}</p>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-xs">
              <label htmlFor="reg-confirm" className="block text-sm font-medium text-stone-700">
                {t("auth.register.field.confirmPassword")}
                <span className="text-expense-400 ml-xs" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <input
                  id="reg-confirm"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder={t("auth.register.field.confirmPasswordPlaceholder")}
                  className={cn(inputClass(!!errors.confirmPassword), "pr-10")}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-xs top-1/2 -translate-y-1/2 p-xs text-stone-400 hover:text-stone-600 transition-colors"
                  aria-label={showConfirm ? t("auth.register.field.hidePassword") : t("auth.register.field.showPassword")}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-expense-400" role="alert">{t(errors.confirmPassword.message ?? "")}</p>
              )}
            </div>

            {/* Gender */}
            <fieldset>
              <legend className="block text-sm font-medium text-stone-700 mb-xs">
                {t("auth.register.field.gender")}
                <span className="text-expense-400 ml-xs" aria-hidden="true">*</span>
              </legend>
              <div className="flex gap-sm">
                {GENDER_OPTIONS.map(({ value, labelKey }) => (
                  <label
                    key={value}
                    className="flex-1 flex items-center gap-sm p-sm border rounded-lg cursor-pointer transition-colors has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50 border-stone-200 hover:bg-stone-50"
                  >
                    <input
                      type="radio"
                      value={value}
                      className="accent-primary-600"
                      {...register("gender")}
                    />
                    <span className="text-sm font-medium text-stone-700">{t(labelKey)}</span>
                  </label>
                ))}
              </div>
              {errors.gender && (
                <p className="text-xs text-expense-400 mt-xs" role="alert">{t(errors.gender.message ?? "")}</p>
              )}
            </fieldset>

            <Button
              type="submit"
              variant="default"
              size="default"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "…" : t("auth.register.action.submit")}
            </Button>
          </form>
        </div>

        {/* Sign in link */}
        <p className="text-center text-sm text-stone-500 mt-lg">
          {t("auth.register.action.alreadyHaveAccount")}{" "}
          <Link
            to="/login"
            className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
          >
            {t("auth.register.action.signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
};
