import { useState } from "react";
import { useForm, submitHandler } from "react-hook-form"l
import { useExpenseContext } from "@/hooks/useExpenseContext";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/ui/popover";
import { LuCalendarDays } from "react-icons/lu";

interface formProps {
  onFormSubmit: () => void;
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
    "Utilities",
  ];
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("usd");
  const [name, setName] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());


  const { addExpenseMutate } = useExpenseContext();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense = {
      name,
      category: selectedCategory,
      amount: parseFloat(amount),
      currency,
      date: format(date, "yyyy-MM-dd"),
      updated_at: new Date().toISOString(),
    };
    addExpenseMutate(newExpense);
    onFormSubmit();
  };

  return (
    <form onSubmit={handleFormSubmit}>
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
              className="w-[340px]"
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
        <div className="mb-2 dark:text-white">
          Date
          <div className="flex justify-row gap-x-1 ">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <LuCalendarDays className="mr-2 h-4 w-4" />
                  {format(date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
