import { useEffect, useState } from "react";
import axios from "axios";
import { toast, Bounce } from "react-toastify";
//import { getCategories } from '../api/api';

const Recurring = () => {
  interface Expense {
    name: string;
    amount: number;
    date: string;
    currency: string;
    frequency: string;
    period: number;
  }

  //const [categories, setCategoryNames] = useState<string[]>([]);
  //const [registered, setRegistered] = useState<Expense[]>([]);

  const [expense, setExpense] = useState({
    name: "",
    amount: 0,
    date: "",
    currency: "usd",
    frequency: "",
    period: 6,
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //console.log(e.target);
    const newRecurring = {
      name: expense.name,
      amount: parseInt(expense.amount.toString()),
      date: new Date(expense.date).toISOString().split("T")[0],
      currency: "usd",
      frequency: expense.frequency,
      period: expense.period,
    };
    console.log(newRecurring);
    //setRegistered((prev) => [...prev, newRecurring]);
    try {
      const response = await axios.post(
        "http://localhost:8000/expenses/",
        newRecurring,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      console.log("response data: ", response.data);
      toast.success(`Added monthly expense`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e: React.FormEvent) => {
    const { name, value } = e.target;
    setExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <div>
        <h1 className="flex justify-center">Register a recurring expense</h1>
        <form
          className="flex flex-col justify-center"
          onSubmit={handleFormSubmit}
        >
          <input
            className="input input-sm input-bordered my-2.5"
            type="text"
            id="blah"
            name="name"
            value={expense.name}
            placeholder="Name"
            onChange={handleChange}
          />
          <input
            className="input input-sm input-bordered my-2.5"
            type="number"
            id="amount"
            name="amount"
            value={expense.amount}
            placeholder="Amount"
            onChange={handleChange}
          />
          <input
            className="input input-sm input-bordered my-2.5"
            type="date"
            id="startBilling"
            name="date"
            value={expense.date}
            placeholder="Billing start date"
            onChange={handleChange}
          />
          <p className="mb-2">Choose billing interval</p>
          <div className="flex flex-row justify-evenly">
            <input
              type="button"
              value="monthly"
              name="frequency"
              className="btn btn-secondary btn-sm"
              onClick={handleChange}
            />
            <input
              type="button"
              value="yearly"
              name="frequency"
              className="btn btn-secondary btn-sm"
              onClick={handleChange}
            />
          </div>
          {expense.frequency !== "" ? (
            <div>
              <p className="my-2">Billing period from start date</p>
              <div className="flex justify-center">
                <input
                  className="input input-xs input-bordered"
                  type="number"
                  id={expense.frequency}
                  name={expense.frequency}
                  placeholder={expense.frequency}
                  value={expense.period}
                  onChange={handleChange}
                />
                <label className="ml-1 inline-block w-12 text-left">
                  {expense.frequency === "monthly" ? "months" : "years"}
                </label>
              </div>
            </div>
          ) : null}
          <button
            type="submit"
            className="btn btn-success mt-3"
            onSubmit={handleFormSubmit}
          >
            Submit
          </button>
        </form>
        <p>{expense.name}</p>
        <p>{expense.amount !== 0 ? expense.amount : null}$</p>
        <p>{expense.date}</p>
        <p>{expense.frequency}</p>
      </div>
    </div>
  );
};
export default Recurring;
