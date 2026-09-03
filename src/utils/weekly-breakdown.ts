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

type Quad = [number, number, number, number];

const bucketAmount = (tx: TransactionResponseDto, week: number): number =>
  tx.transactionsBreakDown?.find((b) => b.weekNumber === week)?.amount ?? 0;

const owedToMeAmount = (tx: TransactionResponseDto): number =>
  (tx.debtOwners ?? [])
    .filter((d) => d.direction === "OWED_TO_ME")
    .reduce((sum, d) => sum + d.amount, 0);

export interface WeekSums {
  weekIncome: Quad;
  weekExpense: Quad;
  /** Total OWED_TO_ME across the set — nets out of the week-1 balance, per backend. */
  owedToMe: number;
}

/**
 * Sum the W1–W4 bucket amounts across a set of transactions, optionally limited
 * to the ones that count toward the month (matches the cashflow report's scope).
 */
export const sumWeeks = (
  txs: TransactionResponseDto[],
  opts: { impactsCashflowOnly?: boolean } = {},
): WeekSums => {
  const weekIncome: Quad = [0, 0, 0, 0];
  const weekExpense: Quad = [0, 0, 0, 0];
  let owedToMe = 0;

  for (const tx of txs) {
    if (opts.impactsCashflowOnly && !tx.impactsCashflow) continue;
    owedToMe += owedToMeAmount(tx);
    for (let i = 0; i < 4; i++) {
      const amount = bucketAmount(tx, i + 1);
      if (amount <= 0.001) continue;
      if (tx.entryType === "INCOME") weekIncome[i] += amount;
      else weekExpense[i] += amount;
    }
  }

  return { weekIncome, weekExpense, owedToMe };
};

export interface WeeklyBreakdown extends WeekSums {
  buckets: [WeekBucket, WeekBucket, WeekBucket, WeekBucket];
  /** Transactions whose W1–W4 don't add up to their monthly amount (0 included). */
  unallocated: UnallocatedEntry[];
}

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
  const unallocated: UnallocatedEntry[] = [];

  for (const tx of txs) {
    let allocated = 0;
    for (let i = 0; i < 4; i++) {
      const amount = bucketAmount(tx, i + 1);
      allocated += amount;
      if (amount <= 0.001) continue;
      buckets[i].entries.push({ tx, amount });
      if (tx.entryType === "INCOME") buckets[i].income += amount;
      else buckets[i].expense += amount;
    }
    if (Math.abs(allocated - tx.monthlyAmount) > 0.01) {
      unallocated.push({ tx, allocated, expected: tx.monthlyAmount });
    }
  }

  return { buckets, unallocated, ...sumWeeks(txs) };
};

// ---------------------------------------------------------------------------
// Week math — mirrors backend getWeekofMonth (fixed day-of-month cutoffs)
// ---------------------------------------------------------------------------

export const weekOfMonth = (day: number): 1 | 2 | 3 | 4 => {
  if (day <= 7) return 1;
  if (day <= 14) return 2;
  if (day <= 21) return 3;
  return 4;
};

/** UTC day-of-month → week. Backend stores transactionDate as UTC midnight. */
export const weekOfDate = (isoDate: string): 1 | 2 | 3 | 4 =>
  weekOfMonth(new Date(isoDate).getUTCDate());

/** Inclusive day range for a week within a given month (monthIndex is 0-based). */
export const weekDayRange = (
  week: 1 | 2 | 3 | 4,
  year: number,
  monthIndex: number,
): { start: number; end: number } => {
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  const starts = [1, 8, 15, 22];
  const ends = [7, 14, 21, lastDay];
  return { start: starts[week - 1], end: ends[week - 1] };
};

/** weekOfMonth(today) when `month` (YYYY-MM) is the current month, else null. */
export const currentWeekForMonth = (month: string): 1 | 2 | 3 | 4 | null => {
  const now = new Date();
  const cur = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return month === cur ? weekOfMonth(now.getDate()) : null;
};

/** AssignBreakDownDto payload placing the whole amount in a single week. */
export const singleWeekPayload = (week: 1 | 2 | 3 | 4, amount: number) => ({
  amountOne: week === 1 ? amount : 0,
  amountTwo: week === 2 ? amount : 0,
  amountThree: week === 3 ? amount : 0,
  amountFour: week === 4 ? amount : 0,
});
