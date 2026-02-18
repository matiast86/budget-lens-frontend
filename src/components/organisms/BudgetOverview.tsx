import { Button } from "../atoms/Button";
import { BudgetProgressItem } from "../molecules/BudgetProgressItem";
import type { BudgetItem } from "../../types";

interface BudgetOverviewProps {
  items: BudgetItem[];
}

export const BudgetOverview = ({ items }: BudgetOverviewProps) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-md">
        <h2 className="section-title">Budget Overview</h2>
        <Button variant="ghost" size="sm">Edit</Button>
      </div>
      <div className="space-y-md">
        {items.map((item, i) => (
          <BudgetProgressItem key={i} {...item} />
        ))}
      </div>
    </div>
  );
}
