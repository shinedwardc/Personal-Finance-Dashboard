export interface BudgetSettings {
  monthlyBudget?: number;
  categoryLimits?: Record<string, number>[];
  overSpendingThreshold?: number;
}

export interface DisplaySettings {
  displayCurrency?: string;
  timeZone?: string;
  dateFormat?: string;
  defaultDashboardRange?: "month" | "quarter" | "year" | "all";
  notificationsEnabled?: boolean;
  incomeAffectsBudget?: boolean;
}
