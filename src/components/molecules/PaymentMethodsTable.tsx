import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Trash2, Check, X, Plus } from "lucide-react";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import type { PaymentMethodResponseDto } from "../../types";

interface PaymentMethodsTableProps {
  methods: PaymentMethodResponseDto[];
  onAdd?: () => void;
  onEdit?: (method: PaymentMethodResponseDto) => void;
  onDelete?: (method: PaymentMethodResponseDto) => void;
}

export const PaymentMethodsTable = ({
  methods,
  onAdd,
  onEdit,
  onDelete,
}: PaymentMethodsTableProps) => {
  const { t } = useTranslation("ledger");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const handleDelete = (pm: PaymentMethodResponseDto) => {
    onDelete?.(pm);
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-sm">
      {onAdd && (
        <div className="flex justify-end">
          <Button size="sm" onClick={onAdd} variant="default">
            <Plus className="w-3.5 h-3.5" />
            {t("paymentMethod.table.addNew")}
          </Button>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-md py-sm text-xs font-semibold text-stone-500 uppercase tracking-wide">
                {t("paymentMethod.table.col.name")}
              </th>
              <th className="px-md py-sm text-xs font-semibold text-stone-500 uppercase tracking-wide">
                {t("paymentMethod.table.col.type")}
              </th>
              <th className="px-md py-sm text-xs font-semibold text-stone-500 uppercase tracking-wide">
                {t("paymentMethod.table.col.brand")}
              </th>
              <th className="px-md py-sm text-xs font-semibold text-stone-500 uppercase tracking-wide">
                {t("paymentMethod.table.col.currency")}
              </th>
              <th className="px-md py-sm text-xs font-semibold text-stone-500 uppercase tracking-wide text-center">
                {t("paymentMethod.table.col.active")}
              </th>
              {(onEdit || onDelete) && (
                <th className="px-md py-sm text-xs font-semibold text-stone-500 uppercase tracking-wide text-right">
                  {t("paymentMethod.table.col.actions")}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {methods.map((pm) => (
              <tr
                key={pm.id}
                className="border-b border-stone-100 hover:bg-stone-50 transition-colors"
              >
                <td className="px-md py-sm">
                  <div className="flex items-center gap-sm">
                    {pm.color && (
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: pm.color }}
                      />
                    )}
                    <span className="text-sm font-medium text-stone-900">
                      {pm.name}
                    </span>
                  </div>
                </td>
                <td className="px-md py-sm">
                  <Badge variant="default">{t(`paymentMethod.type.${pm.type}`)}</Badge>
                </td>
                <td className="px-md py-sm text-sm text-stone-500">
                  {pm.brand ?? <span className="text-stone-300 italic">—</span>}
                </td>
                <td className="px-md py-sm">
                  {pm.currency && <Badge variant="primary">{pm.currency}</Badge>}
                </td>
                <td className="px-md py-sm text-center">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${pm.isActive ? "bg-income-500" : "bg-stone-300"}`}
                  />
                </td>
                {(onEdit || onDelete) && (
                  <td className="px-md py-sm text-right">
                    {confirmDeleteId === pm.id ? (
                      <div className="flex items-center justify-end gap-xs">
                        <span className="text-xs text-stone-500">
                          {t("paymentMethod.table.action.confirmDelete")}
                        </span>
                        <button
                          onClick={() => handleDelete(pm)}
                          className="p-xs rounded text-white bg-expense-400 hover:bg-expense-500 transition-colors"
                          title={t("paymentMethod.table.action.delete")}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="p-xs rounded text-stone-500 hover:bg-stone-100 transition-colors"
                          title={t("paymentMethod.table.action.cancel")}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-xs">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(pm)}
                            className="p-xs rounded text-stone-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                            title={t("paymentMethod.table.action.edit")}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => setConfirmDeleteId(pm.id)}
                            className="p-xs rounded text-stone-400 hover:text-expense-500 hover:bg-expense-50 transition-colors"
                            title={t("paymentMethod.table.action.delete")}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
