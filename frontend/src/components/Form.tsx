import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { categoryConfig } from "@/constants/categoryConfig";
import { LuCalendarDays } from "react-icons/lu";

// Define validation schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  amount: z.number().min(0.01, "Amount is required"),
  currency: z.string().min(1, "Currency is required"),
  date: z.date({ required_error: "Date is required" }),
});

// Infer form types
type FormInputs = z.infer<typeof formSchema>;

interface formProps {
  addingNewExpense: boolean;
  initialValues?: FormInputs & { id?: number | undefined };
  onFormSubmit: () => void;
}

const Form = ({
  addingNewExpense,
  initialValues = {
    name: "",
    amount: 0,
    category: "",
    currency: "usd",
    date: new Date(),
  },
  onFormSubmit,
}: formProps) => {
  const { addExpenseMutate, editExpenseMutate } = useExpenseContext();

  //const [selectedCategory, setSelectedCategory] = useState<string>("");
  //const [amount, setAmount] = useState<string>("");
  //const [currency, setCurrency] = useState<string>("usd");
  //const [name, setName] = useState<string>("");
  //const [date, setDate] = useState<Date>(new Date());

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
      amount: initialValues.amount,
      currency: "usd",
      date: new Date(initialValues.date),
    },
  });

  const onSubmit = (data: FormInputs) => {
    const expense = {
      name: data.name,
      category: data.category,
      amount: data.amount,
      currency: data.currency,
      date: format(data.date, "yyyy-MM-dd"),
      updated_at: new Date().toISOString(),
    };
    if (addingNewExpense) {
      addExpenseMutate(expense);
    } else {
      editExpenseMutate({ expenseId: Number(initialValues.id), data: expense });
    }
    onFormSubmit();
  };

  /*const handleFormSubmit = async (e: React.FormEvent) => {
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
  };*/

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
        <label htmlFor="category" className="mb-2 block dark:text-white">
          Category
        </label>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(categoryConfig).map((category, index) => (
                  <SelectItem key={index} value={category.label}>
                    {category.label} {category.icon}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category.message}</p>
        )}
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
          {addingNewExpense ? "Add" : "Update"} Expense
        </button>
      </div>
    </form>
  );
};

export default Form;
