import { useEffect, useState } from "react";
import { getCategories } from "../api/api";
import axios from "axios";
import { ExpenseInterface } from "../interfaces/expenses";
import { Input } from "./ui/input";
import {   
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "./ui/select";

interface formProps {
  onFormSubmit: (newExpense: ExpenseInterface) => void;
}

const Form = ({ onFormSubmit }: formProps) => {
  const categoryNames = [
    "Bank Fees",
    "Cash Advance",
    "Community",
    "Food and Drink",
    "Healthcare",
    "Interest",
    "Loan Payments",
    "Other",
    "Payment",
    "Recreation",
    "Service",
    "Shops",
    "Tax",
    "Transfer",
    "Travel",
    "Utilities"
  ]
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("usd");
  const [name, setName] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense = {
      name,
      category: selectedCategory,
      amount: parseFloat(amount),
      currency,
      date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
      updated_at: new Date().toISOString(),
    };
    try {
      const response = await axios.post(
        "http://localhost:8000/expenses/",
        newExpense,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      console.log("Expense created:", response.data);
      onFormSubmit(response.data as ExpenseInterface);
    } catch (error: any) {
      if (error.response) {
        console.log("Error response:", error.response.data);
      } else {
        console.log("Error message:", error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name" className="block w-full dark:text-white">
          Name
        </label>
        <Input
          type="text"
          placeholder="Expense or transaction name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="category" className="block dark:text-white">
          Category
        </label>
        <div className="flex items-center space-x-4">
          <Select onValueChange={(value) => setSelectedCategory(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category"></SelectValue>
            </SelectTrigger>
            <SelectContent>
              {categoryNames.map((category, index) => (
                <SelectItem key={index} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-2 mb-2">
        <div className="mb-2 dark:text-white">
          Amount
          <div className="flex justify-row gap-x-1 ">
            <Input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Select onValueChange={(value) => setCurrency(value)}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="USD $"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD $</SelectItem>
                <SelectItem value="eur">EUR €</SelectItem>
                <SelectItem value="gbp">GBP £</SelectItem>
                <SelectItem value="jpy">JPY ¥</SelectItem>
                <SelectItem value="aud">AUD $</SelectItem>
                <SelectItem value="cad">CAD $</SelectItem>
                <SelectItem value="krw">KRW ₩</SelectItem>
                <SelectItem value="inr">INR ₹</SelectItem>
              </SelectContent>  
            </Select>
          </div>
        </div>

      </div>
      <div>
        <button type="submit" className="btn btn-accent rounded mt-3">
          Add Expense
        </button>
      </div>
    </form>
  );
};

export default Form;
