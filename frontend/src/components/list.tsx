import { useState, useEffect } from 'react';
import Expense from './expense';
import { ExpenseInterface } from '../interfaces/interface';
import { getExpense } from '../api/api';


const List = () => {
    const [data,setData] = useState<ExpenseInterface[]>([]);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const list = await getExpense();
                setData(list);
            } catch (error) {
                console.error(error);
            }
        };
        fetchExpenses();
    }, []);

    return (
        <div className = "ml-64 mt-6 w-full border-cyan-500">
            <table className="table-auto border-collapse border border-slate-400 text-sm">
            <thead>
                <tr>
                    <th className="border border-slate-300 px-4 py-2">Category</th>
                    <th className='border border-slate-300 px-4 py-2'>Amount</th>
                    <th className='border border-slate-300 px-4 py-2'>Description</th>
                </tr>
            </thead>
            <tbody>  
                {data.map((expense,key) => (
                    <Expense key={key} data={expense}/>
                ))}
            </tbody>
            </table>
        </div>
    )
}

export default List