export interface User {
  id: number;
  username: string;
}

// Interface for the Category object
export interface Category {
  id: number;
  name: string;
}

export interface ExpenseInterface {
  id: number;
  amount: number;
  description: string;
  start_date: Date;
  end_date: Date;
  created_at: Date;
  updated_at: Date;
  user: User;
  category: Category;
}
