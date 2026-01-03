
export type expenseCategoryKey =
  // Food and Drink
  | "Restaurants"
  | "Coffee & Snacks"
  | "Alcohol & Bars"

  // Everyday Spending
  | "Groceries"
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
    color: "#ffff00",
    icon: "🍽️",
    group: "Food and Drink",
  },
  "Coffee & Snacks": {
    label: "Coffee & Snacks",
    color: "#ffff00",
    icon: "☕",
    group: "Food and Drink",
  },
  "Alcohol & Bars": {
    label: "Alcohol & Bars",
    color: "#ffff00",
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
    color: "#93c5fd",
    icon: "🚌",
    group: "Transportation",
  },
  "Taxi & Ride Share": {
    label: "Taxi & Ride Share",
    color: "#93c5fd",
    icon: "🚗",
    group: "Transportation",
  },
  Fuel: {
    label: "Fuel",
    color: "#93c5fd",
    icon: "⛽",
    group: "Transportation",
  },
  Parking: {
    label: "Parking",
    color: "#93c5fd",
    icon: "🅿️",
    group: "Transportation",
  },
  "Auto Maintenance": {
    label: "Auto Maintenance",
    color: "#93c5fd",
    icon: "🛠️",
    group: "Transportation",
  },

  // Housing & Utilities
  Rent: {
    label: "Rent",
    color: "#ffbf00",
    icon: "🏠",
    group: "Housing and Utilities",
  },
  Mortgage: {
    label: "Mortgage",
    color: "#ffbf00",
    icon: "🏠",
    group: "Housing and Utilities",
  },
  "Home Supplies": {
    label: "Home Supplies",
    color: "#ffbf00",
    icon: "🏠",
    group: "Housing and Utilities",
  },
  Electricity: {
    label: "Electricity",
    color: "#ffbf00",
    icon: "💡",
    group: "Housing and Utilities",
  },
  Water: {
    label: "Water",
    color: "#ffbf00",
    icon: "💧",
    group: "Housing and Utilities",
  },
  Internet: {
    label: "Internet",
    color: "#ffbf00",
    icon: "🌐",
    group: "Housing and Utilities",
  },
  Phone: {
    label: "Phone",
    color: "#ffbf00",
    icon: "📞",
    group: "Housing and Utilities",
  },
  "Maintenance & Repairs": {
    label: "Maintenance & Repairs",
    color: "#ffbf00",
    icon: "🛠️",
    group: "Housing and Utilities",
  },

  // Financial
  "Bank Fees": {
    label: "Bank Fees",
    color: "#000080",
    icon: "🏦",
    group: "Financial",
  },
  Interest: {
    label: "Interest",
    color: "#000080",
    icon: "📈",
    group: "Financial",
  },
  "Loan Payments": {
    label: "Loan Payments",
    color: "#000080",
    icon: "💰",
    group: "Financial",
  },
  Tax: {
    label: "Tax",
    color: "#000080",
    icon: "🧾",
    group: "Financial",
  },
  Insurance: {
    label: "Insurance",
    color: "#000080",
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
    color: "#40e0d0",
    icon: "✈️",
    group: "Travel",
  },
  Hotels: {
    label: "Hotels",
    color: "#40e0d0",
    icon: "🏨",
    group: "Travel",
  },
  "Transportation Travel": {
    label: "Transportation",
    color: "#40e0d0",
    icon: "🗺️",
    group: "Travel",
  },
  "Travel Activities": {
    label: "Travel Activities",
    color: "#40e0d0",
    icon: "🎯",
    group: "Travel",
  },

  // Personal & Other
  "Gifts & Donations": {
    label: "Gifts & Donations",
    color: "#f472b6",
    icon: "🎁",
    group: "Personal",
  },
  Education: {
    label: "Education",
    color: "#f472b6",
    icon: "🎓",
    group: "Personal",
  },
  "Personal Care": {
    label: "Personal Care",
    color: "#f472b6",
    icon: "💗",
    group: "Personal",
  },
  Pets: {
    label: "Pets",
    color: "#f472b6",
    icon: "🐾",
    group: "Personal",
  },
  Other: {
    label: "Other",
    color: "#f472b6",
    icon: "🧾",
    group: "Personal",
  },
};
