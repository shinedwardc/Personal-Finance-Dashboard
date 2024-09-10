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

interface ExpenseData {
  name: string;
  category: { name: string } | string[];
  amount: number;
  currency: keyof Currency;
  date: string;
  id?: string;
}

interface ExpenseProps {
  data: ExpenseData;
  deleteTask: () => void;
}

const currencies: Currency = {
  usd: "$",
  eur: "€",
  gbp: "£",
  jpy: "¥",
  aud: "$",
  cad: "$",
  krw: "₩",
  inr: "₹"
};

const Expense = ({ data, deleteTask }: ExpenseProps) => {
  //console.log("data", data);
  return (
    <tr className="hover">
      <td className="text-lg font-ubtunu font-bold text-center">{data.name}</td>
      <td className="text-base text-center">
        {Array.isArray(data.category) ?  '*' + data.category[0] : data.category.name}
      </td>
      <td className="text-base text-center">{data.amount}{currencies[data.currency]}</td>
      <td className="text-base text-center">{data.currency.toUpperCase()}</td>
      <td className="text-base text-center">{data.date}</td>
      <td>{data.id ? <button className="btn btn-error btn-tiny" onClick={deleteTask}>Delete</button> : null}</td>
    </tr>
  );
};

export default Expense;
