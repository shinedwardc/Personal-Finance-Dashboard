
export type expenseCategoryKey =
  // Everyday Spending
  | "Groceries"
  | "Restaurants"
  | "Coffee & Snacks"
  | "Alcohol & Bars"
  | "Shopping"
  | "Entertainment"
  | "Subscriptions"

  // Transportation
  | "Public Transit"
  | "Taxi & Ride Share"
  | "Fuel"
  | "Parking"
  | "Auto Maintenance"

  // Housing & Utilities
  | "Rent"
  | "Mortgage"
  | "Home Supplies"
  | "Electricity"
  | "Water"
  | "Internet"
  | "Phone"
  | "Maintenance & Repairs"

  // Financial
  | "Bank Fees"
  | "Interest"
  | "Loan Payments"
  | "Tax"
  | "Insurance"

  // Health
  | "Healthcare"
  | "Pharmacy"
  | "Fitness & Sports"

  // Travel
  | "Flights"
  | "Hotels"
  | "Transportation Travel"
  | "Travel Activities"

  // Personal & Misc
  | "Gifts & Donations"
  | "Education"
  | "Personal Care"
  | "Pets"
  | "Other";

export interface expenseCategoryConfig {
  label: string;
  color: string;
  icon: string;
  group: string;
}

export const expenseCategoryConfig: Record<expenseCategoryKey, expenseCategoryConfig> = {
  // Food and drink
  Restaurants: {
    label: "Restaurants",
    color: "#facc15",
    icon: "🍽️",
    group: "Food and Drink",
  },
  "Coffee & Snacks": {
    label: "Coffee & Snacks",
    color: "#facc15",
    icon: "☕",
    group: "Food and Drink",
  },
  "Alcohol & Bars": {
    label: "Alcohol & Bars",
    color: "#facc15",
    icon: "🍺",
    group: "Food and Drink",
  },

  // Everyday Spending
  Groceries: {
    label: "Groceries",
    color: "#c084fc",
    icon: "🛍️",
    group: "Everyday Spending",
  },
  Shopping: {
    label: "Shopping",
    color: "#c084fc",
    icon: "🛒",
    group: "Everyday Spending",
  },
  Entertainment: {
    label: "Entertainment",
    color: "#c084fc",
    icon: "🎮",
    group: "Everyday Spending",
  },
  Subscriptions: {
    label: "Subscriptions",
    color: "#c084fc",
    icon: "🖥️",
    group: "Everyday Spending",
  },

  // Transportation
  "Public Transit": {
    label: "Public Transit",
    color: "#10b981",
    icon: "🚌",
    group: "Transportation",
  },
  "Taxi & Ride Share": {
    label: "Taxi & Ride Share",
    color: "#10b981",
    icon: "🚗",
    group: "Transportation",
  },
  Fuel: {
    label: "Fuel",
    color: "#10b981",
    icon: "⛽",
    group: "Transportation",
  },
  Parking: {
    label: "Parking",
    color: "#10b981",
    icon: "🅿️",
    group: "Transportation",
  },
  "Auto Maintenance": {
    label: "Auto Maintenance",
    color: "#10b981",
    icon: "🛠️",
    group: "Transportation",
  },

  // Housing & Utilities
  Rent: {
    label: "Rent",
    color: "#fbbf24",
    icon: "🏠",
    group: "Housing & Utilities",
  },
  Mortgage: {
    label: "Mortgage",
    color: "#fbbf24",
    icon: "🏠",
    group: "Housing & Utilities",
  },
  "Home Supplies": {
    label: "Home Supplies",
    color: "#fbbf24",
    icon: "🏠",
    group: "Housing & Utilities",
  },
  Electricity: {
    label: "Electricity",
    color: "#fbbf24",
    icon: "💡",
    group: "Housing & Utilities",
  },
  Water: {
    label: "Water",
    color: "#fbbf24",
    icon: "💧",
    group: "Housing & Utilities",
  },
  Internet: {
    label: "Internet",
    color: "#fbbf24",
    icon: "🌐",
    group: "Housing & Utilities",
  },
  Phone: {
    label: "Phone",
    color: "#fbbf24",
    icon: "📞",
    group: "Housing & Utilities",
  },
  "Maintenance & Repairs": {
    label: "Maintenance & Repairs",
    color: "#fbbf24",
    icon: "🛠️",
    group: "Housing & Utilities",
  },

  // Financial
  "Bank Fees": {
    label: "Bank Fees",
    color: "#fde68a",
    icon: "🏦",
    group: "Financial",
  },
  Interest: {
    label: "Interest",
    color: "#fde68a",
    icon: "📈",
    group: "Financial",
  },
  "Loan Payments": {
    label: "Loan Payments",
    color: "#fde68a",
    icon: "💰",
    group: "Financial",
  },
  Tax: {
    label: "Tax",
    color: "#fde68a",
    icon: "🧾",
    group: "Financial",
  },
  Insurance: {
    label: "Insurance",
    color: "#fde68a",
    icon: "🛡️",
    group: "Financial",
  },

  // Health
  Healthcare: {
    label: "Healthcare",
    color: "#f87171",
    icon: "🏥",
    group: "Health",
  },
  Pharmacy: {
    label: "Pharmacy",
    color: "#f87171",
    icon: "💊",
    group: "Health",
  },
  "Fitness & Sports": {
    label: "Fitness & Sports",
    color: "#f87171",
    icon: "🏃‍♂️",
    group: "Health",
  },

  // Travel
  Flights: {
    label: "Flights",
    color: "#34d399",
    icon: "✈️",
    group: "Travel",
  },
  Hotels: {
    label: "Hotels",
    color: "#34d399",
    icon: "🏨",
    group: "Travel",
  },
  "Transportation Travel": {
    label: "Transportation",
    color: "#34d399",
    icon: "🗺️",
    group: "Travel",
  },
  "Travel Activities": {
    label: "Travel Activities",
    color: "#34d399",
    icon: "🎯",
    group: "Travel",
  },

  // Personal & Other
  "Gifts & Donations": {
    label: "Gifts & Donations",
    color: "#e5e7eb",
    icon: "🎁",
    group: "Personal",
  },
  Education: {
    label: "Education",
    color: "#e5e7eb",
    icon: "🎓",
    group: "Personal",
  },
  "Personal Care": {
    label: "Personal Care",
    color: "#e5e7eb",
    icon: "💗",
    group: "Personal",
  },
  Pets: {
    label: "Pets",
    color: "#e5e7eb",
    icon: "🐾",
    group: "Personal",
  },
  Other: {
    label: "Other",
    color: "#e5e7eb",
    icon: "🧾",
    group: "Personal",
  },
};

/*export type SystemKey = "Income";

export type SystemConfig = {
  [key in SystemKey]: {
    label: string;
    color: string;
  };
};

export const systemConfig: SystemConfig = {
  Income: {
    label: "Income",
    color: "green",
  },
};*/
