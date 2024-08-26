const Expense = ({ data, deleteTask }: any) => {
  return (
    <tr className="hover">
      <td className="text-3xl text-center">
        {data.category.name}
      </td>
      <td className="text-2xl text-center">{data.amount}$</td>
      <td>{data.description}</td>
      <td><button className="btn btn-error" onClick={deleteTask}>Delete</button></td>
    </tr>
  );
};

export default Expense;
