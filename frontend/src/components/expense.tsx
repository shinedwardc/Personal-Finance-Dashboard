const Expense = ({ data } : any) => {
    return (
        <tr>  
            <td className="text-3xl italic text-center text-green-300">{data.category.name}</td>
            <td className="text-2xl text-center">{data.amount}$</td>
            <td>{data.description}</td>
        </tr>        
    )
}

export default Expense;