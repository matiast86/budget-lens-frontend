import { useTranslation } from "react-i18next";
import { Badge } from "../atoms/Badge";
import type { PaymentMethodResponseDto } from "../../types";

interface PaymentMethodsTableProps {
  methods: PaymentMethodResponseDto[];
}

export const PaymentMethodsTable = ({ methods }: PaymentMethodsTableProps) => {
  const { t } = useTranslation("ledger");

  return (
    <div className="card p-0 overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-md py-sm text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {t("paymentMethod.table.col.name")}
            </th>
            <th className="px-md py-sm text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {t("paymentMethod.table.col.type")}
            </th>
            <th className="px-md py-sm text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {t("paymentMethod.table.col.brand")}
            </th>
            <th className="px-md py-sm text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {t("paymentMethod.table.col.currency")}
            </th>
            <th className="px-md py-sm text-xs font-semibold text-slate-500 uppercase tracking-wide text-center">
              {t("paymentMethod.table.col.active")}
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
                <Badge variant="default">{t(`paymentMethod.type.${pm.type}`)}</Badge>
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
};
