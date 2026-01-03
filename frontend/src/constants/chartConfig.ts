import { ChartConfig } from "@/components/ui/chart";
import { expenseCategoryKey, expenseCategoryConfig } from "@/constants/expenseCategoryConfig";

export interface ChartCategoryInfo {
  label: string;
  color: string;
}

export const chartConfig: Record<
  "total" | expenseCategoryKey,
  ChartCategoryInfo
> = {
  total: {
    label: "Spent on category",
  },
  // Use reduce to create unique entries for each "group"
  ...Object.values(expenseCategoryConfig).reduce((acc, curr) => {
    if (!acc[curr.group]) {
      acc[curr.group] = {
        label: curr.group,
        color: curr.color, 
      };
    }
    return acc;
  }, {} as Record<string, ChartCategoryInfo>),
} satisfies ChartConfig;
