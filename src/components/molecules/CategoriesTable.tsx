import { useTranslation } from "react-i18next";
import type { CategoryResponseDto } from "../../types";

interface CategoriesTableProps {
  categories: CategoryResponseDto[];
}

export const CategoriesTable = ({ categories }: CategoriesTableProps) => {
  const { t } = useTranslation("ledger");

  return (
    <div className="card p-0 overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-md py-sm text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {t("category.table.col.number")}
            </th>
            <th className="px-md py-sm text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {t("category.table.col.name")}
            </th>
            <th className="px-md py-sm text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {t("category.table.col.description")}
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr
              key={cat.id}
              className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <td className="px-md py-sm text-sm text-slate-400 tabular-nums">
                {cat.id}
              </td>
              <td className="px-md py-sm text-sm font-medium text-slate-900">
                {cat.name}
              </td>
              <td className="px-md py-sm text-sm text-slate-500">
                {cat.description ?? (
                  <span className="text-slate-300 italic">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
