import { ExpenseInterface } from "../interfaces/expenses";

interface Currency {
  usd: string;
  eur: string;
  gbp: string;
  jpy: string;
  aud: string;
  cad: string;
  krw: string;
  inr: string;
}

const currencies: Currency = {
  usd: "$",
  eur: "€",
  gbp: "£",
  jpy: "¥",
  aud: "$",
  cad: "$",
  krw: "₩",
  inr: "₹",
};

const isExpenseData = (id: number | string) => {
  return typeof id === "number";
};

const Expense = ({
  data,
  deleteTask,
}: {
  data: ExpenseInterface;
  deleteTask: () => void;
}) => {
  //console.log("data", data);
  return (
    <tr className="hover:bg-white hover:text-green-800">
      <td className="text-lg font-ubtunu font-bold text-center">{data.name}</td>
      <td className="text-base text-center">
        {typeof data.id === "number" ? data.category : "*" + data.category}
      </td>
      <td className="text-base text-center">
        {data.amount < 0
          ? "+" + (data.amount * -1).toString()
          : data.amount * -1}
        {currencies[data.currency as keyof Currency]}
      </td>
      <td className="text-base text-center">{data.currency.toUpperCase()}</td>
      <td className="text-base text-center">{data.date}</td>
      <td>
        <button
          className={`btn ${isExpenseData(data.id) ? "btn-error" : "btn-disabled"} btn-tiny`}
          onClick={deleteTask}
        >
          {!isExpenseData(data.id) ? "Plaid" : "Delete"}
        </button>
      </td>
    </tr>
  );
};

export default Expense;
