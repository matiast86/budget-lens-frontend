import { Badge } from "../atoms/Badge";
import type { PaymentMethodResponseDto } from "../../types";

const PM_TYPE_LABELS: Record<string, string> = {
  CASH: "Cash",
  BANK: "Bank",
  WALLET: "Wallet",
  CREDIT_CARD: "Credit Card",
  OTHER: "Other",
};

interface PaymentMethodsTableProps {
  methods: PaymentMethodResponseDto[];
}

export const PaymentMethodsTable = ({ methods }: PaymentMethodsTableProps) => (
  <div className="card p-0 overflow-hidden">
    <table className="w-full text-left">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200">
          <th className="px-md py-sm text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Name
          </th>
          <th className="px-md py-sm text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Type
          </th>
          <th className="px-md py-sm text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Brand
          </th>
          <th className="px-md py-sm text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Currency
          </th>
          <th className="px-md py-sm text-xs font-semibold text-slate-500 uppercase tracking-wide text-center">
            Active
          </th>
        </tr>
      </thead>
      <tbody>
        {methods.map((pm) => (
          <tr
            key={pm.id}
            className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <td className="px-md py-sm">
              <div className="flex items-center gap-sm">
                {pm.color && (
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: pm.color }}
                  />
                )}
                <span className="text-sm font-medium text-slate-900">
                  {pm.name}
                </span>
              </div>
            </td>
            <td className="px-md py-sm">
              <Badge variant="default">{PM_TYPE_LABELS[pm.type]}</Badge>
            </td>
            <td className="px-md py-sm text-sm text-slate-500">
              {pm.brand ?? <span className="text-slate-300 italic">—</span>}
            </td>
            <td className="px-md py-sm">
              {pm.currency && <Badge variant="primary">{pm.currency}</Badge>}
            </td>
            <td className="px-md py-sm text-center">
              <span
                className={`inline-block w-2 h-2 rounded-full ${pm.isActive ? "bg-income-500" : "bg-slate-300"}`}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
