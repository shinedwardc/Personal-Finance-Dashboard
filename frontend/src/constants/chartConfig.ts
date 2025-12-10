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
  "total": {
    label: "Spent on category",
  },
  ...Object.fromEntries(
    Object.entries(expenseCategoryConfig).map(([key, config]) => [
      key,
      {
        label: config.group,
        color: config.color,
      } satisfies ChartCategoryInfo,
    ])
  ),
} satisfies ChartConfig;
