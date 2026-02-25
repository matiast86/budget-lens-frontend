import { useTranslation } from "react-i18next";
import { Badge } from "../atoms/Badge";
import type { CollaborationResponseDto } from "../../types";

interface CollaboratorsTableProps {
  collaborations: CollaborationResponseDto[];
}

export const CollaboratorsTable = ({
  collaborations,
}: CollaboratorsTableProps) => {
  const { t } = useTranslation("ledger");

  if (collaborations.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-2xl text-center">
        <p className="section-title mb-xs">{t("collaborator.table.empty.title")}</p>
        <p className="text-sm text-stone-500">
          {t("collaborator.table.empty.body")}
        </p>
      </div>
    );
  }

  return (
    <div className="card p-0 overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-stone-50 border-b border-stone-200">
            <th className="px-md py-sm text-xs font-semibold text-stone-500 uppercase tracking-wide">
              {t("collaborator.table.col.name")}
            </th>
            <th className="px-md py-sm text-xs font-semibold text-stone-500 uppercase tracking-wide text-center">
              {t("collaborator.table.col.status")}
            </th>
          </tr>
        </thead>
        <tbody>
          {collaborations.map((c) => (
            <tr
              key={c.id}
              className="border-b border-stone-100 hover:bg-stone-50 transition-colors"
            >
              <td className="px-md py-sm text-sm font-medium text-stone-900">
                {c.name}
              </td>
              <td className="px-md py-sm text-center">
                <Badge variant={c.isActive ? "income" : "closed"}>
                  {c.isActive ? t("collaborator.active") : t("collaborator.inactive")}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
