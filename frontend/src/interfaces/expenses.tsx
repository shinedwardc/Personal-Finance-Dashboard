export interface ExpenseInterface {
    id: number | string;
    amount: number;
    name: string;
    category: string;
    currency: string;
    frequency: string | null;
    period: number | null;
    date: string;
    updated_at: Date;
    user?: User | string;
}

export interface User {
    first_name: string;
    id: number;
    username: string;
}