export type CategoryKey =
    | "Bank Fees"
    | "Cash Advance"
    | "Community"
    | "Food and Drink"
    | "Healthcare"
    | "Interest"
    | "Loan Payments"
    | "Other"
    | "Payment"
    | "Recreation"
    | "Service"
    | "Shops"
    | "Tax"
    | "Transfer"
    | "Travel"
    | "Utilities";


export type CategoryConfig = {
  [key in CategoryKey]: {
    label: string;
    icon: string;
    color: string;
  };
};

export const categoryConfig: CategoryConfig = {
  "Bank Fees": {
    label: "Bank Fees",
    icon: "🏦",
    color: "light teal",
  },
  "Cash Advance": {
    label: "Cash Advance",
    icon: "💵",
    color: "mint green",
  },
  "Community": {
    label: "Community",
    icon: "🤝",
    color: "emerald",
  },
  "Food and Drink": {
    label: "Food and Drink",
    icon: "🍽️",
    color: "yellow",
  },
  "Healthcare": {
    label: "Healthcare",
    icon: "💊",
    color: "light red",
  },
  "Interest": {
    label: "Interest",
    icon: "📈",
    color: "gold",
  },
  "Loan Payments": {
    label: "Loan Payments",
    icon: "💰",
    color: "sand",
  },
  "Other": {
    label: "Other",
    icon: "❓",
    color: "gray",
  },
  "Payment": {
    label: "Payment",
    icon: "💳",
    color: "blue",
  },
  "Recreation": {
    label: "Recreation",
    icon: "🎭",
    color: "light purple",
  },
  "Service": {
    label: "Service",
    icon: "🛠️",
    color: "light purple",
  },
  "Shops": {
    label: "Shops",
    icon: "🛒",
    color: "purple",
  },
  "Tax": {
    label: "Tax",
    icon: "🧾",
    color: "orange",
  },
  "Transfer": {
    label: "Transfer",
    icon: "🔄",
    color: "sky blue",
  },
  "Travel": {
    label: "Travel",
    icon: "✈️",
    color: "teal",
  },
  "Utilities": {
    label: "Utilities",
    icon: "💡",
    color: "amber",
  },
};

