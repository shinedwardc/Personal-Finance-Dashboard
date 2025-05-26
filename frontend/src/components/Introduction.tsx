import { LuLayoutDashboard } from "react-icons/lu";
import { LuLink } from "react-icons/lu";
import { LuChartArea } from "react-icons/lu";
import { FaMoneyBillTrendUp } from "react-icons/fa6";

const Introduction = ({}) => {
  return (
    <div className="container mx-auto">
      <div className="mt-48 mx-auto flex flex-col items-center justify-center max-w-4xl px-4 gap-y-4">
        <div className="text-center w-full h-full flex flex-col justify-center">
          <div className="flex flex-row justify-center items-center">
            <h1 className="font-semibold p-2 text-3xl">Expense Tracker</h1>
          </div>
          <p className="mt-2 font-light p-2">
            Your personal finance management tool
          </p>
        </div>
        <div className="px-8 w-[720px] h-full flex flex-col justify-center items-center">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="flex items-start gap-3 animate-fade-in">
              <div className="p-2 rounded-lg bg-tailorword-light flex items-center justify-center">
                <LuLayoutDashboard className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-medium text-lg">Breakdown summary</h3>
                <p className="text-gray-600 text-sm">
                  Start managing your budget with an overview of your personal
                  expenses with a detailed breakdown of your spending habits
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 animate-fade-in">
              <div className="p-2 rounded-lg bg-tailorword-light flex items-center justify-center">
                <LuChartArea className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-medium text-lg">Data visualization</h3>
                <p className="text-gray-600 text-sm">
                  Visualize your spending habits with intuitive charts and
                  graphs
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 animate-fade-in">
              <div className="p-2 rounded-lg bg-tailorword-light flex items-center justify-center">
                <LuLink className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-medium text-lg">Integration with Plaid</h3>
                <p className="text-gray-600 text-sm">
                  Simply import your transactions directly from your bank
                  account using Plaid
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 animate-fade-in">
              <div className="p-2 rounded-lg bg-tailorword-light flex items-center justify-center">
                <FaMoneyBillTrendUp className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-medium text-lg">
                  Spending trends & Forecasting
                </h3>
                <p className="text-gray-600 text-sm">
                  See how your spending habits change over time and predict
                  future expenses based on historical data
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
