export interface ExpenseInterface {
  id: number;
  name: string;
  category: string;
  amount: number;
  currency?: string;
  frequency?: string | null;
  period?: number | null;
  date: string;
  notes?: string | null;
  updated_at: string;
}
