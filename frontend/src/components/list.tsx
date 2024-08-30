import { useState, useEffect, useCallback } from "react";
import { useQuery, QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Expense from "./expense";
import { ExpenseInterface } from "../interfaces/interface";
import { getExpense, fetchPlaidTransactions } from "../api/api";
import Form from "./Form";
import axios from "axios";

//https://flowbite.com/docs/components/spinner/#progress-spinner
const queryClient = new QueryClient();

const List = () => {
  const [data, setData] = useState<ExpenseInterface[]>([]);
  const [isPlaidConnected, setIsPlaidConnected] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [useFilteredData, setUseFilteredData] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<ExpenseInterface[]>([]);

  const plaidAccessToken = localStorage.getItem("plaidAccessToken");
  
  const checkPlaidConnection = useCallback(() => {
    return plaidAccessToken !== null;
  }, [plaidAccessToken]);

  const {data : expenseData , isLoading : expenseLoading} = useQuery({
    queryKey: ['expenses'],
    queryFn: getExpense,
  });
  
  const {data : plaidData, isLoading : plaidLoading} = useQuery({
    queryKey: ['plaidData'],
    queryFn: fetchPlaidTransactions,
    enabled: checkPlaidConnection(),
  });
 
  useEffect(() => {
    setIsPlaidConnected(checkPlaidConnection());
  }, [plaidAccessToken,checkPlaidConnection]);

  useEffect(() => {
    if (expenseData) {
      setData(expenseData);
    }
    if (plaidData && isPlaidConnected) {
      setData(prevData => [...prevData, ...plaidData]);
    }
  },[expenseData, plaidData, isPlaidConnected])



  const refetchExpenses = async () => {
    setIsRefreshing(true);
    try {
      const newExpenseData = await getExpense();
      setData(prevData => {
        // Keep all existing data and add new expense data
        return [...prevData, ...newExpenseData];
      });
    } catch (error) {
      console.error("Failed to refetch expenses:", error);
    } finally {
      setIsRefreshing(false);
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

  const handleSearch = (e : React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);
    let searchedData = data;
    if (query.length > 0){
      setUseFilteredData(true);
      const lowerCaseQuery = query.toLowerCase();
      searchedData = searchedData.filter((expense) => expense.description.toLowerCase().includes(lowerCaseQuery) || expense.category.name.toLowerCase().includes(lowerCaseQuery))
      setFilteredData(searchedData);
    }
    else{
      setUseFilteredData(false);
    }
  }


  return (
    <QueryClientProvider client={queryClient}>
      {(isPlaidConnected ? (!(expenseLoading && plaidLoading)) : !expenseLoading) && !isRefreshing ? (
        data.length > 0 ? (
          <>
          <div className="mb-6 border-cyan-500 overflow-x-auto">
            <div className="mb-4 flex justify-center">
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
            </div>
            <table className="table table-auto border-collapse border border-slate-400 text-sm text-center">
              <thead>
                <tr>
                  <th className="border border-slate-300 px-4 py-2">
                    Category
                  </th>
                  <th className="border border-slate-300 px-4 py-2">
                    Amount
                  </th>
                  <th className="border border-slate-300 px-4 py-2">
                    Currency
                  </th>
                  <th className="border border-slate-300 px-4 py-2">Delete</th>
                </tr>
              </thead>
              <tbody>
                {(useFilteredData ? filteredData : data).map((expense, index) => (
                  <Expense
                    key={index}
                    data={expense}
                    deleteTask={() => handleDeleteTask(expense.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
          </>
        ) : (
          <div className="mb-6">
            <p>No expenses listed yet! Add an expense below</p>
          </div>
        )
      ) : (
        <div className="text-center mt-2">
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <div>
        <Form onFormSubmit={refetchExpenses} />
      </div>
    </QueryClientProvider>
  );
};

export default List;
