import { useEffect, useState } from "react";
import { getCategories } from "../api/api";
import axios from "axios";


interface formProps {
  onFormSubmit: () => void;
}

const Form = ({ onFormSubmit }: formProps) => {
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [customCategory, setCustomCategory] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("usd");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        setCategoryNames(categories);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const categoryToSubmit = selectedCategory
      ? selectedCategory
      : customCategory;
    console.log(categoryToSubmit);
    const newExpense = {
      category: { name: categoryToSubmit },
      description,
      amount,
      currency,
      start_date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
      end_date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
      created_at: new Date().toISOString(),
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
    } catch (error: any) {
      if (error.response) {
        console.log("Error response:", error.response.data);
      } else {
        console.log("Error message:", error.message);
      }
    } finally {
      onFormSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="category" className="block">
          Category
        </label>
        <div className="flex items-center space-x-4">
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="select select-bordered p-2 w-full rounded"
          >
            <option value="">Select a category</option>
            {categoryNames.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        {selectedCategory.length <= 0 && (
          <div className="mt-3">
            <input
              type="text"
              placeholder="New custom category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="input input-bordered p-2 rounded"
            />
          </div>
        )}
      </div>
      <div className="mt-2 mb-2">
        <div className="mb-1">
          <label htmlFor="amount" className="block">
            Amount
            <select className="select select-sm select-bordered w-18 ml-2" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="usd">USD $</option>
              <option value="eur">EUR €</option>
              <option value="gbp">GBP £</option>
              <option value="jpy">JPY ¥</option>
              <option value="aud">AUD $</option>
              <option value="cad">CAD $</option>
              <option value="krw">KRW ₩</option>
              <option value="inr">INR ₹</option>
            </select>
          </label>
        </div>
        <input
          type="text"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input input-bordered p-2 w-full rounded"
          required
        />

      </div>

      <div>
        <label htmlFor="description" className="block w-full">
          Description
        </label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input input-bordered p-2 rounded"
        />
      </div>
      <button type="submit" className="btn btn-accent rounded mt-3">
        Add Expense
      </button>
    </form>
  );
};

export default Form;
