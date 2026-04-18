import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Trash2, Check, X, Plus } from "lucide-react";
import { Button } from "../atoms/Button";
import type { GroupResponseDto } from "../../types";

interface GroupsTableProps {
  groups: GroupResponseDto[];
  onAdd?: () => void;
  onEdit?: (group: GroupResponseDto) => void;
  onDelete?: (group: GroupResponseDto) => void;
}

export const GroupsTable = ({
  groups,
  onAdd,
  onEdit,
  onDelete,
}: GroupsTableProps) => {
  const { t } = useTranslation("ledger");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const handleDelete = (group: GroupResponseDto) => {
    onDelete?.(group);
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-sm">
      {onAdd && (
        <div className="flex justify-end">
          <Button size="sm" onClick={onAdd} variant="default">
            <Plus className="w-3.5 h-3.5" />
            {t("group.table.addNew")}
          </Button>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-md py-sm text-xs font-semibold text-stone-500 uppercase tracking-wide">
                {t("group.table.col.number")}
              </th>
              <th className="px-md py-sm text-xs font-semibold text-stone-500 uppercase tracking-wide">
                {t("group.table.col.name")}
              </th>
              {(onEdit || onDelete) && (
                <th className="px-md py-sm text-xs font-semibold text-stone-500 uppercase tracking-wide text-right">
                  {t("group.table.col.actions")}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr
                key={g.id}
                className="border-b border-stone-100 hover:bg-stone-50 transition-colors"
              >
                <td className="px-md py-sm text-sm text-stone-400 tabular-nums">
                  {g.id}
                </td>
                <td className="px-md py-sm text-sm font-medium text-stone-900">
                  {g.name}
                </td>
                {(onEdit || onDelete) && (
                  <td className="px-md py-sm text-right">
                    {confirmDeleteId === g.id ? (
                      <div className="flex items-center justify-end gap-xs">
                        <span className="text-xs text-stone-500">
                          {t("group.table.action.confirmDelete")}
                        </span>
                        <button
                          onClick={() => handleDelete(g)}
                          className="p-xs rounded text-white bg-expense-400 hover:bg-expense-500 transition-colors"
                          title={t("group.table.action.delete")}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="p-xs rounded text-stone-500 hover:bg-stone-100 transition-colors"
                          title={t("group.table.action.cancel")}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-xs">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(g)}
                            className="p-xs rounded text-stone-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                            title={t("group.table.action.edit")}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => setConfirmDeleteId(g.id)}
                            className="p-xs rounded text-stone-400 hover:text-expense-500 hover:bg-expense-50 transition-colors"
                            title={t("group.table.action.delete")}
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
