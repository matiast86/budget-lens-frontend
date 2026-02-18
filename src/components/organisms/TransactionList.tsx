import { Button } from "../atoms/Button";
import { TransactionRow } from "../molecules/TransactionRow";
import type { Transaction } from "../../types";

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="lg:col-span-2 card">
      <div className="flex items-center justify-between mb-md">
        <h2 className="section-title">Recent Transactions</h2>
        <Button variant="ghost" size="sm">View All</Button>
      </div>
      <div className="space-y-sm">
        {transactions.map((tx, i) => (
          <TransactionRow key={i} {...tx} />
        ))}
      </div>
    </div>
  );
}
