export type incomeCategoryKey = 
  | "Salary";

export interface incomeCategoryConfig {
  label: string;
  color: string;
  icon: string;
};

export const incomeCategoryConfig: Record<incomeCategoryKey, incomeCategoryConfig> = {
  Salary: {
    label: "Salary",
    color: "#88e788",
    icon: "💰",
  },
};