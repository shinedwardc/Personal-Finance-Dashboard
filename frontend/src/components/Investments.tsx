import { useEffect, useState } from "react";
import { fetchInvestments } from "@/api/transactions";

interface Stock {
  id: string;
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
}

const Investments = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchInvestments().then((investments) => {
      setStocks(investments);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1>Investments</h1>
      <ul>
        {!loading &&
          stocks.map((stock) => (
            <li key={stock.id}>
              ${stock.symbol}: {stock.currentPrice}$
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Investments;
