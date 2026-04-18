import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";
import { Button } from "../atoms/Button";
import type { GroupResponseDto } from "../../types";

interface GroupModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string }) => Promise<unknown>;
  initialData?: GroupResponseDto;
}

const inputClass = (hasError: boolean) =>
  cn(
    "w-full rounded-md border bg-white px-sm py-xs text-sm text-stone-900 placeholder:text-stone-400",
    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
    hasError ? "border-expense-400" : "border-stone-300",
  );

export const GroupModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
}: GroupModalProps) => {
  const { t } = useTranslation("ledger");
  const isEdit = !!initialData;

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initialData?.name ?? "");
      setNameError("");
      setServerError("");
    }
  }, [open, initialData]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError("");
    setServerError("");

    if (!name.trim()) {
      setNameError(t("group.modal.error.nameRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ name: name.trim() });
      onClose();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-md"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-xl shadow-dropdown flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-lg border-b border-stone-100">
          <h2 className="text-lg font-semibold text-stone-900">
            {isEdit ? t("group.modal.editTitle") : t("group.modal.createTitle")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-xs rounded-md hover:bg-stone-100 transition-colors text-stone-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} noValidate className="p-lg space-y-md">
          {serverError && (
            <div className="rounded-lg bg-expense-50 border border-expense-100 px-sm py-xs text-sm text-expense-600">
              {serverError}
            </div>
          )}

          <div className="space-y-xs">
            <label className="block text-sm font-medium text-stone-700">
              {t("group.modal.field.name")}
              <span className="text-expense-400 ml-xs">*</span>
            </label>
            <input
              type="text"
              autoFocus
              placeholder={t("group.modal.field.namePlaceholder")}
              className={inputClass(!!nameError)}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {nameError && (
              <p className="text-xs text-expense-400">{nameError}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-sm pt-sm border-t border-stone-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              {t("group.modal.action.cancel")}
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isEdit
                ? t("group.modal.action.save")
                : t("group.modal.action.create")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
