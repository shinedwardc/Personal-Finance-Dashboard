import { useState, useEffect } from 'react';
import axios from 'axios';

// Interface for the User object
interface User {
    id: number;
    username: string;
}

// Interface for the Category object
interface Category {
    id: number;
    name: string;
}

interface Expense {
    id: number,
    amount: number,
    description: string,
    start_date: Date,
    end_date: Date,
    created_at: Date,
    updated_at: Date,
    user: User,
    category: Category
}

const Expense = () => {
    const [data,setData] = useState<Expense[]>([]);

    useEffect(() => {
        axios.get('http://localhost:8000/expenses')
        .then(res => {
            setData(res.data.expenses)
        })
        .catch(error => {
            console.error(error);
        });
    }, []);

    return (
        <div className = "flex flex-col justify-center border-cyan-500">
            <table className="border-collapse table-auto w-full text-sm">
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                
                {data.map((m,key) => (
                    <tr key={key}>  
                        <td className="text-3xl italic text-green-300">{m.category.name}</td>
                        <td className="">{m.amount}$</td>
                        <td>{m.description}</td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
    )
}

export default Expense