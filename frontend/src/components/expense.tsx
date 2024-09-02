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
  //console.log("data", data);
  return (
    <tr className="hover">
      <td className="text-lg font-ubtunu font-bold text-center">{data.name}</td>
      <td className="text-base text-center">
        {data.category.length > 0 ? '*' + data.category[0] : data.category.name}
      </td>
      <td className="text-base text-center">{data.amount}{currencies[data.currency.toLowerCase()]}</td>
      <td className="text-base text-center">{data.currency.toUpperCase()}</td>
      <td className="text-base text-center">{data.date}</td>
      <td>{data.id ? <button className="btn btn-error" onClick={deleteTask}>Delete</button> : null}</td>
    </tr>
  );
};

export default Expense;
