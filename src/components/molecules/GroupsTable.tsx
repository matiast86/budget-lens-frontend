import { useTranslation } from "react-i18next";
import type { GroupResponseDto } from "../../types";

interface GroupsTableProps {
  groups: GroupResponseDto[];
}

export const GroupsTable = ({ groups }: GroupsTableProps) => {
  const { t } = useTranslation("ledger");

  return (
    <div className="card p-0 overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-md py-sm text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {t("group.table.col.number")}
            </th>
            <th className="px-md py-sm text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {t("group.table.col.name")}
            </th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => (
            <tr
              key={g.id}
              className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <td className="px-md py-sm text-sm text-slate-400 tabular-nums">
                {g.id}
              </td>
              <td className="px-md py-sm text-sm font-medium text-slate-900">
                {g.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
