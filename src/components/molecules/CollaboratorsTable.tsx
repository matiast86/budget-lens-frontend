import { Badge } from "../atoms/Badge";
import type { CollaborationResponseDto } from "../../types";

interface CollaboratorsTableProps {
  collaborations: CollaborationResponseDto[];
}

export const CollaboratorsTable = ({
  collaborations,
}: CollaboratorsTableProps) => {
  if (collaborations.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-2xl text-center">
        <p className="section-title mb-xs">No collaborators yet</p>
        <p className="text-sm text-slate-500">
          Invite someone by email to share this ledger.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-0 overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-md py-sm text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Name
            </th>
            <th className="px-md py-sm text-xs font-semibold text-slate-500 uppercase tracking-wide text-center">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {collaborations.map((c) => (
            <tr
              key={c.id}
              className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <td className="px-md py-sm text-sm font-medium text-slate-900">
                {c.name}
              </td>
              <td className="px-md py-sm text-center">
                <Badge variant={c.isActive ? "income" : "closed"}>
                  {c.isActive ? "Active" : "Inactive"}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
