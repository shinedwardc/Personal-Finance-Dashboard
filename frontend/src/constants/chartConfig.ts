import { ChartConfig } from "@/components/ui/chart";

export const chartConfig = {
  total: {
    label: "Spent on category",
  },
  "Bank-Fees": {
    label: "Bank Fees",
    color: "#d1fae5", // light teal
  },
  "Cash-Advance": {
    label: "Cash Advance",
    color: "#6ee7b7", // mint green
  },
  Community: {
    label: "Community",
    color: "#10b981", // emerald
  },
  "Food-and-Drink": {
    label: "Food and Drink",
    color: "#facc15", // yellow
  },
  Healthcare: {
    label: "Healthcare",
    color: "#f87171", // light red
  },
  Interest: {
    label: "Interest",
    color: "#fcd34d", // gold
  },
  "Loan-Payments": {
    label: "Loan Payments",
    color: "#fde68a", // sand
  },
  Other: {
    label: "Other",
    color: "#e5e7eb", // gray
  },
  Payment: {
    label: "Payment",
    color: "#60a5fa", // blue
  },
  Recreation: {
    label: "Recreation",
    color: "#a78bfa", // light purple
  },
  Service: {
    label: "Service",
    color: "#f472b6", // pink
  },
  Shops: {
    label: "Shops",
    color: "#c084fc", // purple
  },
  Tax: {
    label: "Tax",
    color: "#fb923c", // orange
  },
  Transfer: {
    label: "Transfer",
    color: "#93c5fd", // sky blue
  },
  Travel: {
    label: "Travel",
    color: "#34d399", // teal
  },
  Utilities: {
    label: "Utilities",
    color: "#fbbf24", // amber
  },
} satisfies ChartConfig;
