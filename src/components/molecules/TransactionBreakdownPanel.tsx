import { BreakdownEditor } from "./BreakdownEditor";
import type { TransactionResponseDto } from "../../types";

interface Props {
  tx: TransactionResponseDto;
  colSpan: number;
  onClose: () => void;
}

/** Inline breakdown editor as a table row — used by `TransactionTable`. */
export const TransactionBreakdownPanel = ({ tx, colSpan, onClose }: Props) => (
  <tr className="bg-primary-50/40 border-b border-primary-100">
    <td colSpan={colSpan} className="px-md py-sm">
      <BreakdownEditor tx={tx} onClose={onClose} />
    </td>
  </tr>
);
