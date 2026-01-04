export interface BudgetSettings {
  monthly_budget?: number;
  income_based_budget?: number;
  category_budget_limits?: Record<string, number>[];
  over_spending_threshold?: number;
}

export interface DisplaySettings {
  display_currency?: string;
  display_timezone?: string;
  display_date_format?: string;
  default_dashboard_range?: "Current Month" | "30 days" | "Quarter" | "Year" | "All";
  notifications_enabled?: boolean;
  income_affects_budget?: boolean;
  income_ratio_for_budget?: number; // 0%-100%
}
