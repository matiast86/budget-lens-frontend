import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../utils/cn";
import { Button } from "../components/atoms/Button";
import { LanguageSwitcher } from "../components/atoms/LanguageSwitcher";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";
import { signIn } from "../services/auth-service";
import { useAuthStore } from "../stores/auth-store";
import { ApiError } from "../services/api-client";

const inputClass = (hasError: boolean) =>
  cn(
    "w-full rounded-md border bg-white px-sm py-xs text-sm text-stone-900 placeholder:text-stone-400",
    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
    hasError ? "border-expense-400" : "border-stone-300",
  );

export const LoginPage = () => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      const { token } = await signIn(data.email, data.password);
      setToken(token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setServerError(t("auth.login.error.invalidCredentials"));
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
          <h1 className="text-2xl font-bold text-stone-900">{t("auth.login.title")}</h1>
          <p className="text-sm text-stone-500 mt-xs">{t("auth.login.subtitle")}</p>
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

            {/* Email */}
            <div className="space-y-xs">
              <label htmlFor="login-email" className="block text-sm font-medium text-stone-700">
                {t("auth.login.field.email")}
                <span className="text-expense-400 ml-xs" aria-hidden="true">*</span>
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                autoFocus
                placeholder={t("auth.login.field.emailPlaceholder")}
                className={inputClass(!!errors.email)}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-expense-400" role="alert">
                  {t(errors.email.message ?? "")}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-xs">
              <label htmlFor="login-password" className="block text-sm font-medium text-stone-700">
                {t("auth.login.field.password")}
                <span className="text-expense-400 ml-xs" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder={t("auth.login.field.passwordPlaceholder")}
                  className={cn(inputClass(!!errors.password), "pr-10")}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-xs top-1/2 -translate-y-1/2 p-xs text-stone-400 hover:text-stone-600 transition-colors"
                  aria-label={
                    showPassword
                      ? t("auth.login.field.hidePassword")
                      : t("auth.login.field.showPassword")
                  }
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-expense-400" role="alert">
                  {t(errors.password.message ?? "")}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="default"
              size="default"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "…" : t("auth.login.action.submit")}
            </Button>
          </form>
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-stone-500 mt-lg">
          {t("auth.login.action.noAccount")}{" "}
          <Link
            to="/register"
            className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
          >
            {t("auth.login.action.register")}
          </Link>
        </p>
      </div>
    </div>
  );
};
