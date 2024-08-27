const Expense = ({ data, deleteTask }: any) => {
  const currencies = {
    "usd": "$",
    "eur": "€",
    "gbp": "£",
    "jpy": "¥",
    "aud": "$",
    "cad": "$",
    "krw": "₩",
    "inr": "₹"
  }
  return (
    <tr className="hover">
      <td className="text-3xl text-center">
        {data.category.name}
      </td>
      <td className="text-3xl text-center">{data.amount}{currencies[data.currency]} ({data.currency.toUpperCase()})</td>
      <td className="text-1xl text-center">{data.description}</td>
      <td><button className="btn btn-error" onClick={deleteTask}>Delete</button></td>
    </tr>
  );
};

export default Expense;
