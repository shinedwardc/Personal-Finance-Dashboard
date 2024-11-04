import Expense from "./expense";
import { ExpenseInterface } from "../interfaces/interface";
import Form from "./Form";
import axios from "axios";

//https://flowbite.com/docs/components/spinner/#progress-spinner

const List = ({data, isLoading, setData} : {data: ExpenseInterface[], isLoading: boolean, setData: React.Dispatch<React.SetStateAction<ExpenseInterface[]>>}) => {
  //const [search, setSearch] = useState<string>("");
  //const [useFilteredData, setUseFilteredData] = useState<boolean>(false);
  //const [filteredData, setFilteredData] = useState<ExpenseInterface[]>([]);

  const refetchExpenses = async (newExpense : ExpenseInterface) => {
    try {
      console.log("newExpense", newExpense);
      setData((prevData) => {
        const combinedData = [...prevData, newExpense];
        return combinedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      });
    } catch (error) {
      console.error("Failed to refetch expenses:", error);
    }
  };

  const handleDeleteTask = async (expenseId: number) => {
    const response = await axios.delete(
      `http://localhost:8000/expenses/${expenseId}/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );
    if (response.status === 204) {
      console.log("Expense deleted successfully");
      setData((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== expenseId),
      );
    } else {
      console.error("Failed to delete expense");
    }
  };

  /*const handleSearch = (e : React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);
    let searchedData = data;
    if (query.length > 0){
      setUseFilteredData(true);
      const lowerCaseQuery = query.toLowerCase();
      searchedData = searchedData.filter((expense) => !Array.isArray(expense.category) ? 
                                          expense.name?.toLowerCase().includes(lowerCaseQuery) : expense.category.name.toLowerCase().includes(lowerCaseQuery))
      setFilteredData(searchedData);
    }
    else{
      setUseFilteredData(false);
    }
  }*/


  return (
    <>
       { !isLoading ? (
          data.length > 0 ? (
            <>
            <div className="mb-6 border-cyan-500 overflow-x-auto">
              {/*<div className="mb-4 flex justify-center">
                <label className="input input-bordered flex items-center w-64 gap-2">
                  <input type="text" className="grow" placeholder="Search" value={search} onChange={handleSearch}/>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70">
                    <path
                      fillRule="evenodd"
                      d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                      clipRule="evenodd" />
                  </svg>
                </label>
              </div>*/}
              <table className="table table-auto bg-green-800 border-collapse border border-slate-400 text-sm text-center">
                <thead>
                  <tr>
                    {["Name", "Category", "Amount", "Currency", "Date", "Delete"].map((header) => (
                      <th key={header} className="border border-slate-300 px-4 py-2">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(data).map((expense, index) => (
                    <Expense
                      key={index}
                      data={expense as ExpenseInterface}
                      deleteTask={() => handleDeleteTask(expense.id as number)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mb-8">
              <Form onFormSubmit={refetchExpenses} />
            </div>            
            </>
          ) : (
            <>
            <div>
              <p>No expenses! Add some</p>
            </div>
            <div className="mb-8">
              <Form onFormSubmit={refetchExpenses} />
            </div>
            </>
          )
        ) : (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        )
      }
    </>
  );
};

export default List;
