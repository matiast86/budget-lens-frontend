import type { TransactionResponseDto } from "../types";

export interface WeekEntry {
  tx: TransactionResponseDto;
  /** The amount allocated to this particular week. */
  amount: number;
}

export interface WeekBucket {
  week: 1 | 2 | 3 | 4;
  entries: WeekEntry[];
  income: number;
  expense: number;
}

export interface UnallocatedEntry {
  tx: TransactionResponseDto;
  allocated: number;
  expected: number;
}

export interface WeeklyBreakdown {
  buckets: [WeekBucket, WeekBucket, WeekBucket, WeekBucket];
  /** Transactions whose W1–W4 don't add up to their monthly amount (0 included). */
  unallocated: UnallocatedEntry[];
  weekIncome: [number, number, number, number];
  weekExpense: [number, number, number, number];
}

const bucketAmount = (tx: TransactionResponseDto, week: number): number =>
  tx.transactionsBreakDown?.find((b) => b.weekNumber === week)?.amount ?? 0;

export const buildWeeklyBreakdown = (
  txs: TransactionResponseDto[],
): WeeklyBreakdown => {
  const mkBucket = (week: 1 | 2 | 3 | 4): WeekBucket => ({
    week,
    entries: [],
    income: 0,
    expense: 0,
  });
  const buckets: WeeklyBreakdown["buckets"] = [
    mkBucket(1),
    mkBucket(2),
    mkBucket(3),
    mkBucket(4),
  ];

  const weekIncome: [number, number, number, number] = [0, 0, 0, 0];
  const weekExpense: [number, number, number, number] = [0, 0, 0, 0];
  const unallocated: UnallocatedEntry[] = [];

  for (const tx of txs) {
    let allocated = 0;
    for (let i = 0; i < 4; i++) {
      const amount = bucketAmount(tx, i + 1);
      allocated += amount;
      if (amount <= 0.001) continue;
      buckets[i].entries.push({ tx, amount });
      if (tx.entryType === "INCOME") {
        buckets[i].income += amount;
        weekIncome[i] += amount;
      } else {
        buckets[i].expense += amount;
        weekExpense[i] += amount;
      }
    }
    if (Math.abs(allocated - tx.monthlyAmount) > 0.01) {
      unallocated.push({ tx, allocated, expected: tx.monthlyAmount });
    }
  }

  return { buckets, unallocated, weekIncome, weekExpense };
};

/** Which week (1–4) the given day-of-month falls into. Mirrors backend getWeekofMonth. */
export const weekOfMonth = (day: number): 1 | 2 | 3 | 4 => {
  if (day <= 7) return 1;
  if (day <= 14) return 2;
  if (day <= 21) return 3;
  return 4;
};
