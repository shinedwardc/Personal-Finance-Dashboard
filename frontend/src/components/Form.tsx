import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTransactionContext } from "@/hooks/useTransactionContext";
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
import { expenseCategoryConfig } from "@/constants/expenseCategoryConfig";
import { incomeCategoryConfig } from "@/constants/incomeCategoryConfig";
import { LuCalendarDays } from "react-icons/lu";

// Define validation schema
const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    category: z.string(),
    type: z.enum(["Expense", "Income"]),
    amount: z.number().min(0.01, "Amount is required"),
    currency: z.string().min(1, "Currency is required"),
    date: z.date({ required_error: "Date is required" }),
  })
  .superRefine((data, ctx) => {
    if (!data.category) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Category is required",
        path: ["category"],
      });
    }
  });

// Infer form types
type FormInputs = z.infer<typeof formSchema>;

interface formProps {
  addingNewTransaction: boolean;
  initialValues?: FormInputs & { id?: number | undefined };
  onFormSubmit: () => void;
}

const Form = ({
  addingNewTransaction,
  initialValues = {
    name: "",
    amount: 0,
    type: "Expense",
    category: "",
    currency: "usd",
    date: new Date(),
  },
  onFormSubmit,
}: formProps) => {
  const [type, setType] = useState<string>(initialValues.type);

  const { addTransactionMutate, editTransactionMutate } = useTransactionContext();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues.name,
      category: initialValues.category,
      type: initialValues.type,
      amount: initialValues.amount,
      currency: "usd",
      date: new Date(initialValues.date),
    },
  });

  const onSubmit = (data: FormInputs) => {
    console.log("Form Data:", data);
    const transaction = {
      name: data.name,
      type: data.type,
      category: data.category,
      amount: data.amount,
      currency: data.currency,
      date: format(data.date, "yyyy-MM-dd"),
      updated_at: new Date().toISOString(),
    };
    if (addingNewTransaction) {
      addTransactionMutate(transaction);
    } else {
      editTransactionMutate({ transactionId: Number(initialValues.id), data: transaction });
    }
    onFormSubmit();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name" className="mb-2 block w-full dark:text-white">
          Name
        </label>
        <Input
          type="text"
          placeholder="Expense or transaction name"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>
      <div className="mt-2">
        <label htmlFor="type" className="mb-2 block dark:text-white">
          Type
        </label>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                setType(value);
              }}
              value={field.value}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Expense">Expense</SelectItem>
                <SelectItem value="Income">Income</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="mt-2">
          <label htmlFor="category" className="mb-2 block dark:text-white">
            Category
          </label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select
                modal={false}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>

                <SelectContent>
                  {type === "Expense"
                    ? Object.values(expenseCategoryConfig).map((category, index) => (
                        <SelectItem key={index} value={category.label}>
                          {category.label} {category.icon}
                        </SelectItem>
                      ))
                    : Object.values(incomeCategoryConfig).map((category, index) => (
                        <SelectItem key={index} value={category.label}>
                          {category.label} {category.icon}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            )}
          />

      </div>
      <div className="mt-2 mb-2">
        <div className="mb-2 dark:text-white">Amount</div>
        <div className="flex justify-row gap-x-1">
          <Controller
            control={control}
            name="amount"
            render={({ field }) => (
              <Input
                type="number"
                {...field}
                value={field.value || ""}
                className="w-[340px]"
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
          <Controller
            control={control}
            name="currency"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="USD $" />
                </SelectTrigger>
                <SelectContent>
                  {["usd", "eur", "gbp", "jpy", "aud", "cad", "krw", "inr"].map(
                    (cur) => (
                      <SelectItem key={cur} value={cur}>
                        {cur.toUpperCase()}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        {errors.amount && (
          <p className="text-red-500 text-sm">{errors.amount.message}</p>
        )}
        {errors.currency && (
          <p className="text-red-500 text-sm">{errors.currency.message}</p>
        )}
      </div>
      <div className="mb-2 dark:text-white">
        Date
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "ml-2 w-[240px] justify-start text-left font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  <LuCalendarDays className="mr-2 h-4 w-4" />
                  {field.value ? format(field.value, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.date && (
          <p className="text-red-500 text-sm">{errors.date.message}</p>
        )}
      </div>
      <div>
        <button type="submit" className="btn btn-accent rounded mt-3">
          {addingNewTransaction ? "Add" : "Update"} Transaction
        </button>
      </div>
    </form>
  );
};

export default Form;
