export interface TransactionInterface {
  id?: number;
  name: string;
  type: "Expense" | "Income";
  category: string;
  amount: number;
  currency?: string;
  frequency?: string | null;
  period?: number | null;
  date: string;
  notes?: string | null;
  updated_at: string;
}
