import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Trash2, Check, X, Plus } from "lucide-react";
import { Button } from "../atoms/Button";
import type { CategoryResponseDto } from "../../types";

interface CategoriesTableProps {
  categories: CategoryResponseDto[];
  onAdd?: () => void;
  onEdit?: (category: CategoryResponseDto) => void;
  onDelete?: (category: CategoryResponseDto) => void;
}

export const CategoriesTable = ({
  categories,
  onAdd,
  onEdit,
  onDelete,
}: CategoriesTableProps) => {
  const { t } = useTranslation("ledger");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const handleDelete = (cat: CategoryResponseDto) => {
    onDelete?.(cat);
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-sm">
      {onAdd && (
        <div className="flex justify-end">
          <Button size="sm" onClick={onAdd} variant="default">
            <Plus className="w-3.5 h-3.5" />
            {t("category.table.addNew")}
          </Button>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-md py-sm text-xs font-semibold text-stone-500 uppercase tracking-wide">
                {t("category.table.col.number")}
              </th>
              <th className="px-md py-sm text-xs font-semibold text-stone-500 uppercase tracking-wide">
                {t("category.table.col.name")}
              </th>
              <th className="px-md py-sm text-xs font-semibold text-stone-500 uppercase tracking-wide">
                {t("category.table.col.description")}
              </th>
              {(onEdit || onDelete) && (
                <th className="px-md py-sm text-xs font-semibold text-stone-500 uppercase tracking-wide text-right">
                  {t("category.table.col.actions")}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr
                key={cat.id}
                className="border-b border-stone-100 hover:bg-stone-50 transition-colors"
              >
                <td className="px-md py-sm text-sm text-stone-400 tabular-nums">
                  {cat.id}
                </td>
                <td className="px-md py-sm text-sm font-medium text-stone-900">
                  {cat.name}
                </td>
                <td className="px-md py-sm text-sm text-stone-500">
                  {cat.description ?? (
                    <span className="text-stone-300 italic">—</span>
                  )}
                </td>
                {(onEdit || onDelete) && (
                  <td className="px-md py-sm text-right">
                    {confirmDeleteId === cat.id ? (
                      <div className="flex items-center justify-end gap-xs">
                        <span className="text-xs text-stone-500">
                          {t("category.table.action.confirmDelete")}
                        </span>
                        <button
                          onClick={() => handleDelete(cat)}
                          className="p-xs rounded text-white bg-expense-400 hover:bg-expense-500 transition-colors"
                          title={t("category.table.action.delete")}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="p-xs rounded text-stone-500 hover:bg-stone-100 transition-colors"
                          title={t("category.table.action.cancel")}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-xs">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(cat)}
                            className="p-xs rounded text-stone-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                            title={t("category.table.action.edit")}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => setConfirmDeleteId(cat.id)}
                            className="p-xs rounded text-stone-400 hover:text-expense-500 hover:bg-expense-50 transition-colors"
                            title={t("category.table.action.delete")}
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
